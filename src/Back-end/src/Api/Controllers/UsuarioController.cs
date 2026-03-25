using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize(Roles = nameof(PerfilUsuario.Sindico))]
public class UsuarioController : ApiControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<UsuarioResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterTodos(CancellationToken cancellationToken)
    {
        return FromResult(await _usuarioService.ObterTodosAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(int id, CancellationToken cancellationToken)
    {
        return FromResult(await _usuarioService.ObterPorIdAsync(id, cancellationToken));
    }

    [HttpPatch("{id:int}/ativo")]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizacaoStatusUsuarioRequest requisicao, CancellationToken cancellationToken)
    {
        return FromResult(await _usuarioService.AtualizarStatusAsync(id, requisicao, cancellationToken));
    }
}
