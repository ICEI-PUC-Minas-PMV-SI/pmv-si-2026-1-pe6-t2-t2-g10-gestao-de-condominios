using SmartSindico.Domain.Exceptions;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Domain.Entities;

public class Visitante
{
    private Visitante() { }

    public int Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public Cpf Cpf { get; private set; } = null!;
    public string Telefone { get; private set; } = string.Empty;
    public string Observacao { get; private set; } = string.Empty; 
    public bool Ativo { get; private set; } = true;

    public ICollection<AcessoVisitante> Acessos { get; private set; } = new List<AcessoVisitante>();
    public int IdApartamento { get; private set; }

    public static Visitante Criar(string nome, Cpf cpf, string telefone, string observacao, int idApartamento)
    {
        return new Visitante { Nome = nome, Cpf = cpf, Telefone = telefone, Observacao = observacao, IdApartamento = idApartamento, Ativo = true };
    }

    public void Atualizar(string nome, string telefone, string observacao, int idApartamento)
    {
        Nome = nome;
        Telefone = telefone;
        Observacao = observacao;
        IdApartamento = idApartamento;
    }

    public void DefinirStatus(bool ativo) => Ativo = ativo;
}