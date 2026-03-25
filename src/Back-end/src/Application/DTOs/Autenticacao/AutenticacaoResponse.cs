namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record AutenticacaoResponse
{
    public string Token { get; init; } = string.Empty;
    public DateTime ExpiraEmUtc { get; init; }
    public PerfilUsuarioResponse Usuario { get; init; } = new();
}
