namespace SmartSindico.Application.DTOs.Comunicados;

public sealed record CriacaoComunicadoRequest
{
    public string Titulo { get; init; } = string.Empty;

    public string Conteudo { get; init; } = string.Empty;

    public bool Destaque { get; init; }
}
