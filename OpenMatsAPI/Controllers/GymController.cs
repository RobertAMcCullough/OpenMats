using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenMatsAPI.Data;
using OpenMatsAPI.DTOs;
using OpenMatsAPI.Helpers;
using OpenMatsAPI.Models;

namespace OpenMatsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class GymsController : ControllerBase
{
    private readonly DataContextEntityFramework _EntityFramework;
    private readonly DataContextDapper _Dapper;
    private readonly IMapper _mapper;
    private readonly AuthHelper _authHelper;

    public GymsController(IConfiguration config)
    {
        _EntityFramework = new DataContextEntityFramework(config);
        _Dapper = new DataContextDapper(config);
        _authHelper = new AuthHelper(config);

        _mapper = new Mapper(new MapperConfiguration((cfg) =>
        {
            cfg.CreateMap<GymUpdateDTO, Gym>();
            cfg.CreateMap<GymCreateDTO, Gym>();
        }));
    }

    [HttpGet()]
    public IEnumerable<Gym>? GetGyms()
    {
        return _EntityFramework.Gyms?.OrderBy(g => g.City).ToList();
    }

    [HttpGet("{gymId}")]
    public Gym? GetGymById(int gymId)
    {
        return _EntityFramework.Gyms?.FirstOrDefault(g => g.Id == gymId);
    }

    [HttpGet("GymWithMats/{gymId}")]
    public IEnumerable<GymWithOpenmatDTO> GetGymWithMats(int gymId)
    {
        var sqlGymQuery = $"SELECT * FROM Gyms INNER JOIN Openmats ON Openmats.GymId = Gyms.Id WHERE Gyms.Id={gymId}";
        var gymsWithMats = _Dapper.Load<GymWithOpenmatDTO>(sqlGymQuery);
        if (gymsWithMats.Count() > 0)
        {
            return gymsWithMats;
        }
        // Covers edge case if gym was somehow created with no attached openmats
        var sqlGymNoMatsQuery = $"SELECT Id AS GymId, Name, Street, City, State, Lat, Lng, Phone, Website, Photo, CreatedAt, GymCreatedBy FROM Gyms WHERE Gyms.Id={gymId}";
        return _Dapper.Load<GymWithOpenmatDTO>(sqlGymNoMatsQuery);
    }

    [HttpGet("Totals")]
    public TotalCountsDTO? GetTotals()
    {
        var sqlTotalsQuery = "SELECT COUNT(DISTINCT Gyms.Id) AS Gyms, COUNT(DISTINCT Gyms.City) AS Cities, COUNT(DISTINCT Openmats.Id) AS Openmats FROM Gyms FULL OUTER JOIN Openmats ON 0=1";
        return _Dapper.LoadSingle<TotalCountsDTO>(sqlTotalsQuery);
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpPut("{gymId}")]
    public Gym? UpdateGym(int gymId, [FromBody] GymUpdateDTO gymUpdate)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var gymDb = _EntityFramework.Gyms?.FirstOrDefault(g => g.Id == gymId);
        _mapper.Map(gymUpdate, gymDb);
        _EntityFramework.SaveChanges();
        return gymDb;
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpPost()]
    public int AddGym(GymCreateDTO gymCreate)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var gymDb = new Gym();
        _mapper.Map(gymCreate, gymDb);
        gymDb.CreatedAt = DateTime.Now;
        gymDb.GymCreatedBy = userId;
        _EntityFramework.Add(gymDb);
        _EntityFramework.SaveChanges();
        return gymDb.Id;
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpDelete("{gymId}")]
    public IActionResult DeleteGym(int gymId)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var gymDb = _EntityFramework.Gyms?.FirstOrDefault(g => g.Id == gymId);
        if (gymDb != null)
        {
            _EntityFramework.Remove(gymDb);
            if (_EntityFramework.SaveChanges() > 0)
            {
                return Ok();
            }
            throw new Exception($"Failed to delete gym with id {gymId}");
        }
        throw new Exception($"Failed to find gym with id {gymId} to delete");
    }
}