using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.Interfaces.Validation;

namespace SmartSindico.Application.Validators;

public sealed class CriacaoComunicadoRequestValidator : IValidator<CriacaoComunicadoRequest>
{
    public Task<ValidationResult> ValidateAsync(CriacaoComunicadoRequest instance, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(instance.Titulo))
        {
            result.AddError(nameof(instance.Titulo), "Titulo e obrigatorio.");
        }
        else if (instance.Titulo.Trim().Length > 150)
        {
            result.AddError(nameof(instance.Titulo), "Titulo deve ter no maximo 150 caracteres.");
        }

        if (string.IsNullOrWhiteSpace(instance.Conteudo))
        {
            result.AddError(nameof(instance.Conteudo), "Conteudo e obrigatorio.");
        }

        return Task.FromResult(result);
    }
}
