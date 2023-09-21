using System.Data.Common;
using Dapper;
using Microsoft.Data.SqlClient;

namespace OpenMatsAPI.Data;

public class DataContextDapper
{
    private readonly IConfiguration _config;

    public DataContextDapper(IConfiguration config)
    {
        _config = config;
    }

    public IEnumerable<T> Load<T>(string sql)
    {
        DbConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("ConnectionStrings:Default"));
        return connection.Query<T>(sql);
    }

    public T? LoadSingle<T>(string sql)
    {
        DbConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("ConnectionStrings:Default"));
        return connection.QuerySingle<T>(sql);
    }

    public bool Execute(string sql)
    {
        DbConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("ConnectionStrings:Default"));
        return connection.Execute(sql) > 0;
    }
}