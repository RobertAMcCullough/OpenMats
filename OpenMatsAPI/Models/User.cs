using System.Text.Json.Serialization;

namespace OpenMatsAPI.Models;
public class User
{
    public int Id { get; set; }
    public string? GoogleId { get; set; } = "";
    public string? FacebookId { get; set; } = "";
    public string? TwitterId { get; set; } = "";
    public string Username { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string? LastName { get; set; } = "";
    [JsonIgnore] 
    public string PasswordHash { get; set; } = "";
    public string? Photo { get; set; } = "";
    public string? Email { get; set; } = "";
    public string? Location { get; set; } = "";
    public DateTime? CreatedAt { get; set; }
}