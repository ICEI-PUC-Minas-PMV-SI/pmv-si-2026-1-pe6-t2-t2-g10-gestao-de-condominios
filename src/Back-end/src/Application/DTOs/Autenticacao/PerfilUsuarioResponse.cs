namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record PerfilUsuarioResponse
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Telefone { get; init; }
    public string Perfil { get; init; } = string.Empty;
    public int? IdApartamento { get; init; }
}
