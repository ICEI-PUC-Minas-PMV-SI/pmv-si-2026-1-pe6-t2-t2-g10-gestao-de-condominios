using System.ComponentModel.DataAnnotations;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Validation;

namespace SmartSindico.Application.Validators;

public sealed class AtualizacaoUsuarioRequestValidator : IValidator<AtualizacaoUsuarioRequest>
{
    private static readonly EmailAddressAttribute EmailValidator = new();
    private static readonly PhoneAttribute PhoneValidator = new();

    public Task<ValidationResult> ValidateAsync(
        AtualizacaoUsuarioRequest instance,
        CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(instance.Nome))
        {
            result.AddError(nameof(instance.Nome), "Nome é obrigatório.");
        }
        else if (instance.Nome.Trim().Length > 120)
        {
            result.AddError(nameof(instance.Nome), "Nome deve ter no máximo 120 caracteres.");
        }

        if (string.IsNullOrWhiteSpace(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail é obrigatório.");
        }
        else if (!EmailValidator.IsValid(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail inválido.");
        }

        if (!string.IsNullOrWhiteSpace(instance.Senha) && instance.Senha.Trim().Length < 6)
        {
            result.AddError(nameof(instance.Senha), "Senha deve ter no mínimo 6 caracteres.");
        }

        if (!string.IsNullOrWhiteSpace(instance.Telefone) && !PhoneValidator.IsValid(instance.Telefone))
        {
            result.AddError(nameof(instance.Telefone), "Telefone inválido.");
        }

        if (!Enum.IsDefined(instance.Perfil))
        {
            result.AddError(nameof(instance.Perfil), "Perfil inválido.");
        }

        return Task.FromResult(result);
    }
}
