using Microsoft.EntityFrameworkCore;

namespace Digihoito.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Väliaikainen testitaulu jotta migraatio syntyy
    public DbSet<TestEntity> TestEntities => Set<TestEntity>();
}

public class TestEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
