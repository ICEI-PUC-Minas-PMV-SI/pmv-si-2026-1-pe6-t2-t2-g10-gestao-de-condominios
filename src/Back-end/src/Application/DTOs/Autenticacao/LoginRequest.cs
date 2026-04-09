namespace SmartSindico.Application.DTOs.Autenticacao;

public sealed record LoginRequest
{
    public string Email { get; init; } = string.Empty;

    public string Senha { get; init; } = string.Empty;
}
