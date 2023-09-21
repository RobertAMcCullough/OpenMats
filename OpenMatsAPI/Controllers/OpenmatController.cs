using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenMatsAPI.Data;
using OpenMatsAPI.DTOs;
using OpenMatsAPI.Models;
using OpenMatsAPI.Helpers;

namespace OpenMatsAPI.Controllers;

//TODO: Add Repository for this Controller
[ApiController]
[Route("[controller]")]
public class OpenmatsController : ControllerBase
{
    private readonly DataContextEntityFramework _EntityFramework;
    private readonly DataContextDapper _Dapper;
    private readonly IMapper _mapper;
    private readonly AuthHelper _authHelper;

    public OpenmatsController(IConfiguration config)
    {
        _EntityFramework = new DataContextEntityFramework(config);
        _Dapper = new DataContextDapper(config);
        _authHelper = new AuthHelper(config);

        _mapper = new Mapper(new MapperConfiguration((cfg) =>
        {
            cfg.CreateMap<MatUpdateDTO, Openmat>();
            cfg.CreateMap<MatCreateDTO, Openmat>();
        }));
    }

    [HttpGet()]
    public IEnumerable<GymWithOpenmatDTO>? GetOpenmats()
    {


        var a = HttpContext.Request.Query["lat"];

        decimal Lat = decimal.TryParse(HttpContext.Request.Query["lat"], out var parsedLat) ? parsedLat : 45m;
        decimal Lng = decimal.TryParse(HttpContext.Request.Query["lng"], out var parsedLng) ? parsedLng : 45m;
        decimal? Distance = decimal.TryParse(HttpContext.Request.Query["distance"], out var parsedDistance) ? parsedDistance : (decimal?)null;

        decimal? Rad = Distance != null ? Distance / 68.7m : 0.728m; //radius is degrees lat/lng. 1 degree = 68.7 miles. default is 50 miles

        var sqlMatQuery = $"SELECT * FROM Gyms, Openmats WHERE lat > {Lat - Rad} AND lat < {Lat + Rad} AND lng < {Lng + Rad} AND lng > {Lng - Rad} AND Gyms.Id = Openmats.GymId";

        return _Dapper.Load<GymWithOpenmatDTO>(sqlMatQuery);

    }

    [HttpGet("{matId}")]
    public GymWithOpenmatDTO? GetOpenmatById(int matId)
    {
        var sqlMatQuery = $"SELECT * FROM Openmats JOIN Gyms ON Gyms.Id = Openmats.gymId WHERE Openmats.Id={matId}";
        return _Dapper.LoadSingle<GymWithOpenmatDTO>(sqlMatQuery);
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpPut("{matId}")]
    public Openmat? UpdateOpenmat(int matId, [FromBody] MatUpdateDTO matUpdate)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var matDb = _EntityFramework.Openmats?.FirstOrDefault(o => o.Id == matId);
        _mapper.Map(matUpdate, matDb);
        if (matDb != null)
        {
            matDb.UpdatedBy = userId;
            matDb.UpdatedAt = DateTime.Now;
            _EntityFramework.SaveChanges();
            return matDb;
        }
        throw new Exception($"Could not find openmat with id {matId} to update.");
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpPost()]
    public int AddOpenmat(MatCreateDTO matCreate)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var matDb = new Openmat();
        _mapper.Map(matCreate, matDb);
        matDb.CreatedAt = DateTime.Now;
        matDb.CreatedBy = userId;
        _EntityFramework.Add(matDb);
        _EntityFramework.SaveChanges();
        return matDb.Id;
    }

    // TODO: Replace manual cookie testing with [Authorize] and app.UseAuthentication();
    [HttpDelete("{matId}")]
    public IActionResult DeleteGym(int matId)
    {
        var cookie = Request.Cookies["jwt"];
        if (cookie == null) throw new Exception("User needs to be logged in");
        var userId = _authHelper.VerifyAndGetUserId(cookie) ?? throw new Exception("User needs to be logged in");

        var matDb = _EntityFramework.Openmats?.FirstOrDefault(o => o.Id == matId);
        if (matDb != null)
        {
            _EntityFramework.Remove(matDb);
            if (_EntityFramework.SaveChanges() > 0)
            {
                return Ok();
            }
            throw new Exception($"Failed to delete gym with id {matId}");
        }
        throw new Exception($"Failed to find gym with id {matId} to delete");
    }
}