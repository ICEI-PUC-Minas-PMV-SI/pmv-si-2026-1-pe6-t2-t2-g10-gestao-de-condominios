using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class ComunicadoConfiguration : IEntityTypeConfiguration<Comunicado>
{
    public void Configure(EntityTypeBuilder<Comunicado> builder)
    {
        builder.ToTable("Comunicado");

        builder.HasKey(comunicado => comunicado.Id);

        builder.Property(comunicado => comunicado.Id)
            .HasColumnName("Id")
            .UseIdentityByDefaultColumn();

        builder.Property(comunicado => comunicado.IdAutor)
            .HasColumnName("IdUsuarioAutor")
            .IsRequired();

        builder.Property(comunicado => comunicado.Titulo)
            .HasColumnName("Titulo")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(comunicado => comunicado.Conteudo)
            .HasColumnName("Conteudo")
            .IsRequired();

        builder.Property(comunicado => comunicado.DataPublicacao)
            .HasColumnName("DataPublicacao")
            .IsRequired();

        builder.Property(comunicado => comunicado.Ativo)
            .HasColumnName("Ativo")
            .IsRequired();

        builder.Property(comunicado => comunicado.Destaque)
            .HasColumnName("Destaque")
            .IsRequired();

        builder.HasOne(comunicado => comunicado.Autor)
            .WithMany(usuario => usuario.ComunicadosCriados)
            .HasForeignKey(comunicado => comunicado.IdAutor)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
