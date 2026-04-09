using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record CadastroRequest
{
    public string Nome { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string Senha { get; init; } = string.Empty;

    public string Cpf { get; init; } = string.Empty;

    public string? Telefone { get; init; }

    public PerfilUsuario Perfil { get; init; }

    public int? IdApartamento { get; init; }
}
