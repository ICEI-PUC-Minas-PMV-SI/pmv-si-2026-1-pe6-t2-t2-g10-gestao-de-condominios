using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Domain.ValueObjects;

public sealed record Cpf
{
    private Cpf(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Cpf Criar(string value)
    {
        var sanitizado = new string((value ?? string.Empty).Where(char.IsDigit).ToArray());
        if (sanitizado.Length != 11)
        {
            throw new DomainException("CPF invalido.");
        }

        return new Cpf(sanitizado);
    }

}
