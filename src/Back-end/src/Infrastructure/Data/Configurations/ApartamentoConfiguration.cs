using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class ApartamentoConfiguration : IEntityTypeConfiguration<Apartamento>
{
    public void Configure(EntityTypeBuilder<Apartamento> builder)
    {
        builder.ToTable("Apartamentos");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Numero).IsRequired().HasMaxLength(20);
    }
}