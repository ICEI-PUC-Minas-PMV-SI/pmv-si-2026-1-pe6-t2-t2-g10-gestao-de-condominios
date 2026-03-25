using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Application.Results;

namespace SmartSindico.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult FromResult<T>(
        Result<T> result,
        int successStatusCode = StatusCodes.Status200OK,
        string? createdAtActionName = null,
        string? createdAtControllerName = null,
        object? routeValues = null)
    {
        if (result.IsSuccess)
        {
            if (successStatusCode == StatusCodes.Status201Created && !string.IsNullOrWhiteSpace(createdAtActionName))
            {
                return CreatedAtAction(createdAtActionName, createdAtControllerName, routeValues, result.Value);
            }

            return StatusCode(successStatusCode, result.Value);
        }

        return result.FailureType switch
        {
            ErrorType.Validation => ValidationProblem(CriarValidationProblemDetails(result)),
            ErrorType.NotFound => Problem(title: result.Error, statusCode: StatusCodes.Status404NotFound),
            ErrorType.Unauthorized => Problem(title: result.Error, statusCode: StatusCodes.Status401Unauthorized),
            ErrorType.Forbidden => Problem(title: result.Error, statusCode: StatusCodes.Status403Forbidden),
            ErrorType.Conflict => Problem(title: result.Error, statusCode: StatusCodes.Status409Conflict),
            _ => Problem(title: "Falha na operacao.", statusCode: StatusCodes.Status400BadRequest)
        };
    }

    protected bool TryGetUsuarioAtualId(out int idUsuario)
    {
        var userIdText = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return int.TryParse(userIdText, out idUsuario);
    }

    private static ValidationProblemDetails CriarValidationProblemDetails<T>(Result<T> result)
    {
        var errors = result.ValidationErrors
            .GroupBy(error => error.Field)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.Message).ToArray());

        return new ValidationProblemDetails(errors)
        {
            Title = "Falha de validacao.",
            Detail = result.Error,
            Status = StatusCodes.Status400BadRequest
        };
    }
}
