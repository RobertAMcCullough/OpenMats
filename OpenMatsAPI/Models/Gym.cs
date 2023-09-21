namespace OpenMatsAPI.Models;

public class Gym
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Street { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public decimal? Lat { get; set; }
    public decimal? Lng { get; set; }
    public string? Phone { get; set; } = "";
    public string? Website { get; set; } = "";
    public string? Photo { get; set; } = "";
    public int GymCreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}