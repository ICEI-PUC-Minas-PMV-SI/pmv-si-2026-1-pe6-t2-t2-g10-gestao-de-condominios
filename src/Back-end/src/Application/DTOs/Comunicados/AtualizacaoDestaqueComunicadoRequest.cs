namespace SmartSindico.Application.DTOs.Comunicados;

public sealed record AtualizacaoDestaqueComunicadoRequest
{
    public bool Destaque { get; init; }
}
