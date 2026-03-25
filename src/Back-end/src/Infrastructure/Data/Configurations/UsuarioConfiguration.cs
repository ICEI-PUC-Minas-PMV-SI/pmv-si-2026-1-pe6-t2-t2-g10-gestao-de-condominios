using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Infrastructure.Data.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("Usuario");

        builder.HasKey(usuario => usuario.Id);

        builder.Property(usuario => usuario.Id)
            .HasColumnName("Id")
            .UseIdentityByDefaultColumn();

        builder.Property(usuario => usuario.Nome)
            .HasColumnName("Nome")
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(usuario => usuario.Email)
            .HasColumnName("Email")
            .HasConversion(
                email => email.Value,
                value => Email.Criar(value))
            .HasMaxLength(180)
            .IsRequired();

        builder.Property(usuario => usuario.SenhaHash)
            .HasColumnName("SenhaHash")
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(usuario => usuario.Cpf)
            .HasColumnName("CPF")
            .HasConversion(
                cpf => cpf.Value,
                value => Cpf.Criar(value))
            .HasMaxLength(11)
            .IsRequired();

        builder.Property(usuario => usuario.Telefone)
            .HasColumnName("Telefone")
            .HasMaxLength(20);

        builder.Property(usuario => usuario.Perfil)
            .HasColumnName("TipoUsuario")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(usuario => usuario.IdApartamento)
            .HasColumnName("IdApartamento");

        builder.Property(usuario => usuario.Ativo)
            .HasColumnName("Ativo")
            .IsRequired();

        builder.Property(usuario => usuario.DataCriacao)
            .HasColumnName("DataCriacao")
            .IsRequired();

        builder.Property(usuario => usuario.DataUltimoLogin)
            .HasColumnName("DataUltimoLogin");

        builder.HasIndex(usuario => usuario.Email)
            .IsUnique();

        builder.HasIndex(usuario => usuario.Cpf)
            .IsUnique();
    }
}
