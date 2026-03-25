using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Domain.Entities;

public class Comunicado
{
    private Comunicado()
    {
    }

    public int Id { get; private set; }
    public int IdAutor { get; private set; }
    public string Titulo { get; private set; } = string.Empty;
    public string Conteudo { get; private set; } = string.Empty;
    public DateTime DataPublicacao { get; private set; } = DateTime.UtcNow;
    public bool Ativo { get; private set; } = true;
    public bool Destaque { get; private set; }

    public Usuario? Autor { get; private set; }

    public static Comunicado Criar(
        int idAutor,
        string titulo,
        string conteudo,
        bool destaque,
        DateTime? dataPublicacaoUtc = null)
    {
        if (idAutor <= 0)
        {
            throw new DomainException("Autor do comunicado invalido.");
        }

        if (string.IsNullOrWhiteSpace(titulo))
        {
            throw new DomainException("Titulo e obrigatorio.");
        }

        if (titulo.Trim().Length > 150)
        {
            throw new DomainException("Titulo deve ter no maximo 150 caracteres.");
        }

        if (string.IsNullOrWhiteSpace(conteudo))
        {
            throw new DomainException("Conteudo e obrigatorio.");
        }

        return new Comunicado
        {
            IdAutor = idAutor,
            Titulo = titulo.Trim(),
            Conteudo = conteudo.Trim(),
            Destaque = destaque,
            Ativo = true,
            DataPublicacao = dataPublicacaoUtc ?? DateTime.UtcNow
        };
    }

    public void DefinirStatus(bool ativo)
    {
        Ativo = ativo;
    }

    public void AssociarAutor(Usuario autor)
    {
        Autor = autor ?? throw new DomainException("Autor do comunicado e obrigatorio.");
    }
}
