using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.DTOs.Common;
using SmartSindico.Application.Results;

namespace SmartSindico.Application.Interfaces.Services;

public interface IComunicadoService
{
    Task<Result<PaginacaoResponse<ComunicadoResponse>>> ObterAtivosAsync(PaginacaoRequest paginacao, CancellationToken cancellationToken = default);
    Task<Result<ComunicadoResponse>> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<ComunicadoResponse>> CriarAsync(int idAutor, CriacaoComunicadoRequest requisicao, CancellationToken cancellationToken = default);
    Task<Result<ComunicadoResponse>> AtualizarDestaqueAsync(int id, AtualizacaoDestaqueComunicadoRequest requisicao, CancellationToken cancellationToken = default);
    Task<Result<ComunicadoResponse>> AtualizarStatusAsync(int id, AtualizacaoStatusComunicadoRequest requisicao, CancellationToken cancellationToken = default);
}
