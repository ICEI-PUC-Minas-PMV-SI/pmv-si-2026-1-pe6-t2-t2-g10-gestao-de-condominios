using SmartSindico.Application.Validators;

namespace SmartSindico.Application.Interfaces.Validation;

public interface IValidator<in T>
{
    Task<ValidationResult> ValidateAsync(T instance, CancellationToken cancellationToken = default);
}
