using Microsoft.AspNetCore.Mvc;
using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException exception)
        {
            _logger.LogWarning(exception, "Falha de dominio durante o processamento da requisicao.");

            if (context.Response.HasStarted)
            {
                throw;
            }

            await WriteProblemAsync(
                context,
                StatusCodes.Status400BadRequest,
                "Falha de dominio.",
                exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Erro nao tratado durante o processamento da requisicao.");

            if (context.Response.HasStarted)
            {
                throw;
            }

            await WriteProblemAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "Erro interno do servidor.",
                "Ocorreu uma falha inesperada ao processar a requisicao.");
        }
    }

    private static Task WriteProblemAsync(
        HttpContext context,
        int statusCode,
        string title,
        string detail)
    {
        context.Response.Clear();
        context.Response.StatusCode = statusCode;

        var problem = new ProblemDetails
        {
            Title = title,
            Detail = detail,
            Status = statusCode
        };

        return context.Response.WriteAsJsonAsync(problem);
    }
}
