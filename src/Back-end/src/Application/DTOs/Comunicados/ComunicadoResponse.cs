namespace SmartSindico.Application.DTOs.Comunicados;

public sealed record ComunicadoResponse
{
    public int Id { get; init; }
    public int IdAutor { get; init; }
    public string NomeAutor { get; init; } = string.Empty;
    public string Titulo { get; init; } = string.Empty;
    public string Conteudo { get; init; } = string.Empty;
    public DateTime DataPublicacao { get; init; }
    public bool Ativo { get; init; }
    public bool Destaque { get; init; }
}
