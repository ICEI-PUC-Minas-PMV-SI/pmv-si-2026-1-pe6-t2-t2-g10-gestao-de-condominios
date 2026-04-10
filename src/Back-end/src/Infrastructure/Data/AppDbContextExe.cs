using Microsoft.EntityFrameworkCore;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data;

namespace CondominioApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AreaComum> AreasComuns { get; set; }
    public DbSet<ReservaAreaComum> Reservas { get; set; }
}
