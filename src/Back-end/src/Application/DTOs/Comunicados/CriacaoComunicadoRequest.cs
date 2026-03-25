using System.ComponentModel.DataAnnotations;

namespace SmartSindico.Application.DTOs.Comunicados;

public sealed record CriacaoComunicadoRequest
{
    [Required]
    [MaxLength(150)]
    public string Titulo { get; init; } = string.Empty;

    [Required]
    public string Conteudo { get; init; } = string.Empty;

    public bool Destaque { get; init; }
}
