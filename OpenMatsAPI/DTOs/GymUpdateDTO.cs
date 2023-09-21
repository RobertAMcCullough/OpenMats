namespace OpenMatsAPI.DTOs;

public class GymUpdateDTO
{
    public string Name { get; set; } = "";
    public string? Street { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public decimal? Lat { get; set; }
    public decimal? Lng { get; set; }
    public string? Phone { get; set; } = "";
    public string? Website { get; set; } = "";
    public string? Photo { get; set; } = "";
}