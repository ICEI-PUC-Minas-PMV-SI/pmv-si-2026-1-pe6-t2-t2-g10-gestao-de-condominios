using System.ComponentModel.DataAnnotations;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Validation;

namespace SmartSindico.Application.Validators;

public sealed class CadastroRequestValidator : IValidator<CadastroRequest>
{
    private static readonly EmailAddressAttribute EmailValidator = new();
    private static readonly PhoneAttribute PhoneValidator = new();

    public Task<ValidationResult> ValidateAsync(CadastroRequest instance, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(instance.Nome))
        {
            result.AddError(nameof(instance.Nome), "Nome e obrigatorio.");
        }
        else if (instance.Nome.Trim().Length > 120)
        {
            result.AddError(nameof(instance.Nome), "Nome deve ter no maximo 120 caracteres.");
        }

        if (string.IsNullOrWhiteSpace(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail e obrigatorio.");
        }
        else if (!EmailValidator.IsValid(instance.Email))
        {
            result.AddError(nameof(instance.Email), "E-mail invalido.");
        }

        if (string.IsNullOrWhiteSpace(instance.Senha))
        {
            result.AddError(nameof(instance.Senha), "Senha e obrigatoria.");
        }
        else if (instance.Senha.Length < 6)
        {
            result.AddError(nameof(instance.Senha), "Senha deve ter no minimo 6 caracteres.");
        }

        var cpfSanitizado = new string((instance.Cpf ?? string.Empty).Where(char.IsDigit).ToArray());
        if (cpfSanitizado.Length != 11)
        {
            result.AddError(nameof(instance.Cpf), "CPF invalido.");
        }

        if (!string.IsNullOrWhiteSpace(instance.Telefone) && !PhoneValidator.IsValid(instance.Telefone))
        {
            result.AddError(nameof(instance.Telefone), "Telefone invalido.");
        }

        if (!Enum.IsDefined(instance.Perfil))
        {
            result.AddError(nameof(instance.Perfil), "Perfil invalido.");
        }

        return Task.FromResult(result);
    }
}
