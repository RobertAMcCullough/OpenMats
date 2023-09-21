using Microsoft.AspNetCore.Mvc;
using OpenMatsAPI.Data;
using OpenMatsAPI.DTOs;
using OpenMatsAPI.Models;
using OpenMatsAPI.Helpers;
using APIOne.DTOs;
using System.Collections;

namespace OpenMatsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    AuthHelper _authHelper;
    IConfiguration _config;
    private readonly DataContextEntityFramework _EntityFramework;

    public AuthController(IConfiguration config)
    {
        _config = config;
        _EntityFramework = new DataContextEntityFramework(config);
        _authHelper = new AuthHelper(config);
    }

    [HttpPost("Register")]
    public IActionResult RegisterUser(UserRegistrationDTO userToRegister)
    {
        if (_EntityFramework.Users?.FirstOrDefault(u => u.Username == userToRegister.Username) == null)
        {
            // var passwordSalt = _authHelper.GetUniqueKey(32);

            // var passwordHash = _authHelper.GetPasswordHash(userToRegister.Password, passwordSalt);
            var passwordHash = _authHelper.GetPasswordHash(userToRegister.Password);

            var newUser = new User()
            {
                Username = userToRegister.Username,
                FirstName = userToRegister.FirstName,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.Now
            };

            _EntityFramework.Add(newUser);
            if (_EntityFramework.SaveChanges() > 0)
            {
                var token = _authHelper.CreateToken(newUser.Id);

                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = true
                });

                return Ok(newUser.Id);
            }

            throw new Exception("Failed to add Auth entry");
        }
        return BadRequest(new { error = "User Already Exists" });
    }

    [HttpPost("Login")]
    public IActionResult LoginUser(UserLoginDTO userLoginDto)
    {
        var userToLogin = _EntityFramework.Users?.FirstOrDefault(u => u.Username == userLoginDto.Username);
        if (userToLogin != null)
        {
            var hash = _authHelper.GetPasswordHash(userLoginDto.Password);

            Console.WriteLine("hash is");
            Console.WriteLine(hash);
            Console.WriteLine("userToLogin hash is");
            Console.WriteLine(userToLogin.PasswordHash);

            if (hash != userToLogin.PasswordHash)
            {
                return StatusCode(401, "Credentials Failed");
            }

            var token = _authHelper.CreateToken(userToLogin.Id);

            Console.WriteLine("token is");
            Console.WriteLine(token);
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return Ok();
        }

        return BadRequest(new { error = "Invalid Credentials" });
    }

    [HttpGet("CurrentUser")]
    public User? GetCurrentUser()
    {
        try
        {
            var jwt = Request.Cookies["jwt"];

            if (jwt == null)
            {
                return null;
            }

            var token = _authHelper.Verify(jwt);

            int userId = int.Parse(token.Issuer);

            var user = _EntityFramework.Users?.FirstOrDefault(u => u.Id == userId);

            return user;
        }
        catch (Exception)
        {
            throw new Exception("Error: Unauthorized");
        }
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");
        return Redirect(Environment.GetEnvironmentVariable("AppSettings:ClientBaseURL") + "/");
    }

    // Just confirms that API is up
    [HttpGet("/")]
    public IActionResult Test()
    {
        return Ok("Openmats API is running");
    }
}