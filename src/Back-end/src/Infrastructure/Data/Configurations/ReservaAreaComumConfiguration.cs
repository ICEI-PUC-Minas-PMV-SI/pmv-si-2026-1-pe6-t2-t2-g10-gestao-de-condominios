using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class ReservaAreaComumConfiguration : IEntityTypeConfiguration<ReservaAreaComum>
{
    public void Configure(EntityTypeBuilder<ReservaAreaComum> builder)
    {
        builder.ToTable("ReservaAreaComum");
        builder.HasKey(reserva => reserva.Id);
    }
}
