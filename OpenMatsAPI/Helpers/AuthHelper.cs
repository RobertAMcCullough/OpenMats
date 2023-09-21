using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;

namespace OpenMatsAPI.Helpers;

// TODO: Could switch to BCrypt to simplify
public class AuthHelper
{
    IConfiguration _config;
    internal static readonly char[] chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();

    public AuthHelper(IConfiguration config)
    {
        _config = config;
    }

    public string GetPasswordHash(string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("AppSettings:PasswordKey") ?? ""),
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 500,
            numBytesRequested: 256 / 8
        )) ?? "";
    }

    public string CreateToken(int userId)
    {
        var tokenKey = Environment.GetEnvironmentVariable("AppSettings:JwtKey");

        // create symmetric key from config key
        var symmetricKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(tokenKey != null ? tokenKey : "")
        );

        // create credentials from symmetric key
        var credentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256Signature);

        var header = new JwtHeader(credentials);

        var payload = new JwtPayload(userId.ToString(), null, null, null, DateTime.Today.AddDays(14));

        var securityToken = new JwtSecurityToken(header, payload);

        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }

    public JwtSecurityToken Verify(string jwt)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenKey = Environment.GetEnvironmentVariable("AppSettings:JwtKey");

        // create symmetric key from config key
        var symmetricKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(tokenKey != null ? tokenKey : "")
        );

        tokenHandler.ValidateToken(jwt, new TokenValidationParameters
        {
            IssuerSigningKey = symmetricKey,
            ValidateIssuerSigningKey = true,
            ValidateIssuer = false,
            ValidateAudience = false
        }, out SecurityToken validatedToken);

        return (JwtSecurityToken)validatedToken;
    }

    public int? VerifyAndGetUserId(string jwt)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenKey = Environment.GetEnvironmentVariable("AppSettings:JwtKey");

        // create symmetric key from config key
        var symmetricKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(tokenKey != null ? tokenKey : "")
        );

        tokenHandler.ValidateToken(jwt, new TokenValidationParameters
        {
            IssuerSigningKey = symmetricKey,
            ValidateIssuerSigningKey = true,
            ValidateIssuer = false,
            ValidateAudience = false
        }, out SecurityToken validatedToken);

        var token = (JwtSecurityToken)validatedToken;

        return int.Parse(token.Issuer);
    }
}