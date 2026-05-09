using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class AcessoVisitanteConfiguration : IEntityTypeConfiguration<AcessoVisitante>
{
    public void Configure(EntityTypeBuilder<AcessoVisitante> builder)
    {
        builder.ToTable("AcessoVisitantes");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.DataHoraEntrada).IsRequired();

        // ADICIONA ISSO:
        builder.HasOne(a => a.Visitante)
               .WithMany(v => v.Acessos)
               .HasForeignKey(a => a.IdVisitante);
    }
}