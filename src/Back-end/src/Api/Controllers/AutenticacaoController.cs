using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Services;

namespace SmartSindico.Api.Controllers;

[ApiController]
[Route("api/autenticacao")]
[Authorize]
public class AutenticacaoController : ApiControllerBase
{
    private readonly IAutenticacaoService _autenticacaoService;

    public AutenticacaoController(IAutenticacaoService autenticacaoService)
    {
        _autenticacaoService = autenticacaoService;
    }

    [HttpPost("entrar")]
    [AllowAnonymous]
    [ProducesResponseType<AutenticacaoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Entrar([FromBody] LoginRequest requisicao, CancellationToken cancellationToken)
    {
        var result = await _autenticacaoService.EntrarAsync(requisicao, cancellationToken);
        return FromResult(result);
    }
}
