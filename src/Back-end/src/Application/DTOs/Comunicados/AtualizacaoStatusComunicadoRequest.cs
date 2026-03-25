namespace SmartSindico.Application.DTOs.Comunicados;

public sealed record AtualizacaoStatusComunicadoRequest
{
    public bool Ativo { get; init; }
}
