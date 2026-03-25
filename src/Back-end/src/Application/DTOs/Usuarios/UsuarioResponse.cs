namespace SmartSindico.Application.DTOs.Usuarios;

public sealed record UsuarioResponse
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Cpf { get; init; } = string.Empty;
    public string? Telefone { get; init; }
    public string Perfil { get; init; } = string.Empty;
    public int? IdApartamento { get; init; }
    public bool Ativo { get; init; }
    public DateTime DataCriacao { get; init; }
    public DateTime? DataUltimoLogin { get; init; }
}
