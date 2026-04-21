using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.DTOs.Usuarios;

public sealed class AtualizacaoUsuarioRequest
{
    public string Nome { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string? Senha { get; init; }

    public string? Telefone { get; init; }

    public PerfilUsuario Perfil { get; init; }

    public int? IdApartamento { get; init; }

    public bool Ativo { get; init; }
}
