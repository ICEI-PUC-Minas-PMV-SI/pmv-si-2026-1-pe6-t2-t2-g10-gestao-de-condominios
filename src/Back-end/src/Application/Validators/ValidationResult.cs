namespace SmartSindico.Application.Validators;

public sealed class ValidationResult
{
    private readonly List<ValidationError> _errors = [];

    public bool IsValid => _errors.Count == 0;

    public IReadOnlyList<ValidationError> Errors => _errors;

    public void AddError(string field, string message)
    {
        _errors.Add(new ValidationError(field, message));
    }
}
