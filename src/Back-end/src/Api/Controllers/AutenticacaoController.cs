using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Api.Controllers;

[ApiController]
[Route("api/autenticacao")]
public class AutenticacaoController : ApiControllerBase
{
    private readonly IAutenticacaoService _autenticacaoService;

    public AutenticacaoController(IAutenticacaoService autenticacaoService)
    {
        _autenticacaoService = autenticacaoService;
    }

    [HttpPost("cadastrar")]
    [Authorize(Roles = $"{nameof(PerfilUsuario.Funcionario)},{nameof(PerfilUsuario.Sindico)}")]
    [ProducesResponseType<AutenticacaoResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Cadastrar([FromBody] CadastroRequest requisicao, CancellationToken cancellationToken)
    {
        if (User.IsInRole(nameof(PerfilUsuario.Funcionario)) && requisicao.Perfil != PerfilUsuario.Morador)
        {
            return Problem(
                title: "Perfil sem permissao para cadastrar este tipo de usuario.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        var result = await _autenticacaoService.CadastrarAsync(requisicao, cancellationToken);
        return FromResult(result, StatusCodes.Status201Created);
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
