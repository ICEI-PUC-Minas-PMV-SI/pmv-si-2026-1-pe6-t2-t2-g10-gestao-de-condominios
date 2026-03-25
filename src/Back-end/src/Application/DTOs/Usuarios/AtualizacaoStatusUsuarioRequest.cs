namespace SmartSindico.Application.DTOs.Usuarios;

public sealed record AtualizacaoStatusUsuarioRequest
{
    public bool Ativo { get; init; }
}
