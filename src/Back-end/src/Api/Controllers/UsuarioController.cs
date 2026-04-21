using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Services;

namespace SmartSindico.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize]
public class UsuarioController : ApiControllerBase
{
    private readonly IUsuarioService _usuarioService;
    private readonly IAuthorizationService _authorizationService;

    public UsuarioController(IUsuarioService usuarioService, IAuthorizationService authorizationService)
    {
        _usuarioService = usuarioService;
        _authorizationService = authorizationService;
    }

    [HttpPost]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Cadastrar([FromBody] CadastroRequest requisicao, CancellationToken cancellationToken)
    {
        var autorizacao = await _authorizationService.AuthorizeAsync(
            User,
            requisicao,
            PoliticasAutorizacao.CadastrarUsuario);

        if (!autorizacao.Succeeded)
        {
            return Problem(
                title: "Perfil sem permissão para cadastrar este tipo de usuário.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        return FromResult(await _usuarioService.CadastrarAsync(requisicao, cancellationToken), StatusCodes.Status201Created);
    }

    [HttpGet]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<IReadOnlyList<UsuarioResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ObterTodos(CancellationToken cancellationToken)
    {
        var resultadoUsuarios = await _usuarioService.ObterTodosAsync(cancellationToken);
        if (!resultadoUsuarios.IsSuccess)
        {
            return FromResult(resultadoUsuarios);
        }

        var usuariosVisiveis = new List<UsuarioResponse>();
        foreach (var usuario in resultadoUsuarios.Value!)
        {
            var autorizacao = await _authorizationService.AuthorizeAsync(
                User,
                usuario,
                PoliticasAutorizacao.VisualizarUsuario);

            if (autorizacao.Succeeded)
            {
                usuariosVisiveis.Add(usuario);
            }
        }

        return Ok(usuariosVisiveis);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(int id, CancellationToken cancellationToken)
    {
        var resultadoUsuario = await _usuarioService.ObterPorIdAsync(id, cancellationToken);
        if (!resultadoUsuario.IsSuccess)
        {
            return FromResult(resultadoUsuario);
        }

        var autorizacao = await _authorizationService.AuthorizeAsync(
            User,
            resultadoUsuario.Value!,
            PoliticasAutorizacao.VisualizarUsuario);

        if (!autorizacao.Succeeded)
        {
            return Problem(
                title: "Usuário sem permissão para visualizar este cadastro.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        return FromResult(resultadoUsuario);
    }

    [HttpPatch("{id:int}")]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Atualizar(
        int id,
        [FromBody] AtualizacaoUsuarioRequest requisicao,
        CancellationToken cancellationToken)
    {
        var resultadoUsuario = await _usuarioService.ObterPorIdAsync(id, cancellationToken);
        if (!resultadoUsuario.IsSuccess)
        {
            return FromResult(resultadoUsuario);
        }

        var autorizacao = await _authorizationService.AuthorizeAsync(
            User,
            new AtualizarUsuarioResource(resultadoUsuario.Value!, requisicao),
            PoliticasAutorizacao.AtualizarUsuario);

        if (!autorizacao.Succeeded)
        {
            return Problem(
                title: "Usuário sem permissão para editar este cadastro.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        return FromResult(await _usuarioService.AtualizarAsync(id, requisicao, cancellationToken));
    }

    [HttpPatch("{id:int}/ativo")]
    [Authorize(Roles = PerfisAutorizacao.FuncionarioOuSindico)]
    [ProducesResponseType<UsuarioResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizacaoStatusUsuarioRequest requisicao, CancellationToken cancellationToken)
    {
        var resultadoUsuario = await _usuarioService.ObterPorIdAsync(id, cancellationToken);
        if (!resultadoUsuario.IsSuccess)
        {
            return FromResult(resultadoUsuario);
        }

        var autorizacao = await _authorizationService.AuthorizeAsync(
            User,
            resultadoUsuario.Value!,
            PoliticasAutorizacao.AtualizarStatusUsuario);

        if (!autorizacao.Succeeded)
        {
            return Problem(
                title: "Usuário sem permissão para alterar o status deste cadastro.",
                statusCode: StatusCodes.Status403Forbidden);
        }

        return FromResult(await _usuarioService.AtualizarStatusAsync(id, requisicao, cancellationToken));
    }
}
