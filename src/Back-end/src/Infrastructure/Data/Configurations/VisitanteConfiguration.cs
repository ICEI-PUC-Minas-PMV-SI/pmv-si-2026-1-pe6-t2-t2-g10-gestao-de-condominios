using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class VisitanteConfiguration : IEntityTypeConfiguration<Visitante>
{
    public void Configure(EntityTypeBuilder<Visitante> builder)
    {
        builder.ToTable("Visitantes");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Nome).IsRequired().HasMaxLength(100);

        builder.OwnsOne(v => v.Cpf, cpfBuilder =>
        {
            cpfBuilder.Property(c => c.Value)
                .HasColumnName("CPF")
                .IsRequired()
                .HasMaxLength(11);
        });
    }
}