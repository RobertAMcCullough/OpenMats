using Microsoft.EntityFrameworkCore;
using OpenMatsAPI.Models;

namespace OpenMatsAPI.Data;

public class DataContextEntityFramework : DbContext
{
    private readonly IConfiguration _config;

    public DataContextEntityFramework(IConfiguration config)
    {
        _config = config;
    }

    public DbSet<User>? Users { get; set; }
    public DbSet<Gym>? Gyms { get; set; }
    public DbSet<Openmat>? Openmats { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("ConnectionStrings:Default") ?? "",
            optionsBuilder => optionsBuilder.EnableRetryOnFailure());
        }
    }
}