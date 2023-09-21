using System.Text.Json.Serialization;

namespace OpenMatsAPI.DTOs;

public class MatUpdateDTO
{
    public string Day { get; set; } = "";
    public TimeSpan Time { get; set; }
    public int? Cost { get; set; }
    [JsonPropertyName("call_first")]
    public int? CallFirst { get; set; }
    public string? Size { get; set; } = "";
    [JsonPropertyName("gi_nogi")]
    public int? GiNogi { get; set; }
    public string? Notes { get; set; } = "";
}