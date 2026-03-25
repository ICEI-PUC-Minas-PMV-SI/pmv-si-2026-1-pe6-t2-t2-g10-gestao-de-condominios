using System.ComponentModel.DataAnnotations;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Validation;

namespace SmartSindico.Application.Validators;

public sealed class LoginRequestValidator : IValidator<LoginRequest>
{
    private static readonly EmailAddressAttribute EmailValidator = new();

    public Task<ValidationResult> ValidateAsync(LoginRequest instance, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail é obrigatório.");
        }
        else if (!EmailValidator.IsValid(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail inválido.");
        }

        if (string.IsNullOrWhiteSpace(instance.Senha))
        {
            result.AddError(nameof(instance.Senha), "Senha é obrigatória.");
        }
        else if (instance.Senha.Length < 6)
        {
            result.AddError(nameof(instance.Senha), "Senha deve ter no mínimo 6 caracteres.");
        }

        return Task.FromResult(result);
    }
}
