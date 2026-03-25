using System.ComponentModel.DataAnnotations;

namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Senha { get; init; } = string.Empty;
}
