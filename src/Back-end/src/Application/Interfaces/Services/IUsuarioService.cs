using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Results;

namespace SmartSindico.Application.Interfaces.Services;

public interface IUsuarioService
{
    Task<Result<UsuarioResponse>> CadastrarAsync(CadastroRequest requisicao, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<UsuarioResponse>>> ObterTodosAsync(CancellationToken cancellationToken = default);
    Task<Result<UsuarioResponse>> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<UsuarioResponse>> AtualizarStatusAsync(int id, AtualizacaoStatusUsuarioRequest requisicao, CancellationToken cancellationToken = default);
}
