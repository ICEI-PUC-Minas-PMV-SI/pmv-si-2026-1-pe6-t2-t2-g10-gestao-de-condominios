using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.Interfaces.Services;

namespace SmartSindico.Api.Controllers;

[ApiController]
[Route("api/comunicados")]
[Authorize]
public class ComunicadoController : ApiControllerBase
{
    private readonly IComunicadoService _comunicadoService;

    public ComunicadoController(IComunicadoService comunicadoService)
    {
        _comunicadoService = comunicadoService;
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<ComunicadoResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterAtivos(CancellationToken cancellationToken)
    {
        return FromResult(await _comunicadoService.ObterAtivosAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<ComunicadoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(int id, CancellationToken cancellationToken)
    {
        return FromResult(await _comunicadoService.ObterPorIdAsync(id, cancellationToken));
    }

    [HttpPost]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<ComunicadoResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Criar([FromBody] CriacaoComunicadoRequest requisicao, CancellationToken cancellationToken)
    {
        if (!TryGetUsuarioAtualId(out var idUsuario))
        {
            return Unauthorized();
        }

        var result = await _comunicadoService.CriarAsync(idUsuario, requisicao, cancellationToken);
        return FromResult(
            result,
            StatusCodes.Status201Created,
            nameof(ObterPorId),
            routeValues: result.IsSuccess ? new { id = result.Value!.Id } : null);
    }

    [HttpPatch("{id:int}/ativo")]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<ComunicadoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizacaoStatusComunicadoRequest requisicao, CancellationToken cancellationToken)
    {
        return FromResult(await _comunicadoService.AtualizarStatusAsync(id, requisicao, cancellationToken));
    }

    [HttpPatch("{id:int}/destaque")]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<ComunicadoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarDestaque(int id, [FromBody] AtualizacaoDestaqueComunicadoRequest requisicao, CancellationToken cancellationToken)
    {
        return FromResult(await _comunicadoService.AtualizarDestaqueAsync(id, requisicao, cancellationToken));
    }
}
