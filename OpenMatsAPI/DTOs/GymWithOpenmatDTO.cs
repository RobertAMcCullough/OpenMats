using System.Text.Json.Serialization;

namespace OpenMatsAPI.DTOs;

public class GymWithOpenmatDTO
{
    // Gym properties
    [JsonPropertyName("gym_id")]
    public int GymId { get; set; }
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
    // Openmat properties
    public int Id { get; set; }
    public string Day { get; set; } = "";
    public TimeSpan Time { get; set; }
    public int? Cost { get; set; }
    [JsonPropertyName("call_first")]
    public int? CallFirst { get; set; }
    public string? Size { get; set; } = "";
    [JsonPropertyName("gi_nogi")]
    public int? GiNogi { get; set; }
    public string? Notes { get; set; } = "";
    public DateTime UpdatedAt { get; set; }

}