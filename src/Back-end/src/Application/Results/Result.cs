using SmartSindico.Application.Validators;

namespace SmartSindico.Application.Results;

public sealed class Result<T>
{
    private Result(T value)
    {
        IsSuccess = true;
        Value = value;
        ValidationErrors = [];
    }

    private Result(string error, string errorCode, ErrorType errorType, IReadOnlyList<ValidationError>? validationErrors = null)
    {
        IsSuccess = false;
        Error = error;
        ErrorCode = errorCode;
        FailureType = errorType;
        ValidationErrors = validationErrors ?? [];
    }

    public bool IsSuccess { get; }

    public T? Value { get; }

    public string? Error { get; }

    public string? ErrorCode { get; }

    public ErrorType? FailureType { get; }

    public IReadOnlyList<ValidationError> ValidationErrors { get; }

    public static Result<T> Success(T value)
    {
        return new Result<T>(value);
    }

    public static Result<T> Failure(string error, string errorCode, ErrorType errorType)
    {
        return new Result<T>(error, errorCode, errorType);
    }

    public static Result<T> ValidationFailure(IReadOnlyList<ValidationError> validationErrors)
    {
        var error = validationErrors.FirstOrDefault()?.Message ?? "Requisicao invalida.";
        return new Result<T>(error, "VALIDATION_ERROR", Results.ErrorType.Validation, validationErrors);
    }
}
