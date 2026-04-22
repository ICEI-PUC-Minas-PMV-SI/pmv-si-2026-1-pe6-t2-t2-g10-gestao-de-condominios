using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Common;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.Interfaces.Services;

public interface IUsuarioService
{
    Task<Result<UsuarioResponse>> CadastrarAsync(CadastroRequest requisicao, CancellationToken cancellationToken = default);
    Task<Result<PaginacaoResponse<UsuarioResponse>>> ObterTodosAsync(
        PerfilUsuario perfilAtual,
        int idUsuarioAtual,
        string? search,
        PaginacaoRequest paginacao,
        CancellationToken cancellationToken = default);
    Task<Result<UsuarioResponse>> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<UsuarioResponse>> AtualizarAsync(int id, AtualizacaoUsuarioRequest requisicao, CancellationToken cancellationToken = default);
    Task<Result<UsuarioResponse>> AtualizarStatusAsync(int id, AtualizacaoStatusUsuarioRequest requisicao, CancellationToken cancellationToken = default);
}
