using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Domain.Entities;

public class Apartamento
{
    private Apartamento() { }

    public int Id { get; private set; }
    public string Numero { get; private set; } = string.Empty;
    public string Bloco { get; private set; } = string.Empty;
    public int Andar { get; private set; }
    public string Tipo { get; private set; } = string.Empty;
    public bool Ativo { get; private set; } = true;

    public static Apartamento Criar(string numero, string bloco, int andar, string tipo)
    {
        if (string.IsNullOrWhiteSpace(numero)) throw new DomainException("Número é obrigatório.");
        return new Apartamento { Numero = numero, Bloco = bloco, Andar = andar, Tipo = tipo, Ativo = true };
    }
    public void Atualizar(string numero, string bloco, int andar, string tipo)
    {
        Numero = numero; Bloco = bloco; Andar = andar; Tipo = tipo;
    }
}