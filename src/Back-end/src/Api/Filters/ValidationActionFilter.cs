using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SmartSindico.Api.Filters;

public sealed class ValidationActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ModelState.IsValid)
        {
            return;
        }

        context.Result = new BadRequestObjectResult(new ValidationProblemDetails(context.ModelState)
        {
            Title = "Falha de validacao.",
            Status = StatusCodes.Status400BadRequest
        });
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
