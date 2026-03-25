using System.ComponentModel.DataAnnotations;
using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Domain.ValueObjects;

public sealed record Email
{
    private static readonly EmailAddressAttribute EmailValidator = new();

    private Email(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Email Criar(string value)
    {
        var normalizado = (value ?? string.Empty).Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(normalizado) || !EmailValidator.IsValid(normalizado))
        {
            throw new DomainException("E-mail invalido.");
        }

        return new Email(normalizado);
    }

}
