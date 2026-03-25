using System.ComponentModel.DataAnnotations;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record CadastroRequest
{
    [Required]
    [MaxLength(120)]
    public string Nome { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Senha { get; init; } = string.Empty;

    [Required]
    [MinLength(11)]
    [MaxLength(14)]
    public string Cpf { get; init; } = string.Empty;

    [Phone]
    public string? Telefone { get; init; }

    [Required]
    [EnumDataType(typeof(PerfilUsuario))]
    public PerfilUsuario Perfil { get; init; }

    public int? IdApartamento { get; init; }
}
