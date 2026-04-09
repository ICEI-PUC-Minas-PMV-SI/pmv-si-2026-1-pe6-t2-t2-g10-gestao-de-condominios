using Microsoft.EntityFrameworkCore;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Comunicado> Comunicados => Set<Comunicado>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Apartamento> Apartamentos => Set<Apartamento>();
    public DbSet<Visitante> Visitantes => Set<Visitante>();
    public DbSet<AcessoVisitante> AcessoVisitantes => Set<AcessoVisitante>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
