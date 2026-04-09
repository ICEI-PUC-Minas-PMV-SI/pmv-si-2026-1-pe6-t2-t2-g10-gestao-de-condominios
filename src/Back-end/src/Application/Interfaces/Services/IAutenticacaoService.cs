using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Results;

namespace SmartSindico.Application.Interfaces.Services;

public interface IAutenticacaoService
{
    Task<Result<AutenticacaoResponse>> EntrarAsync(LoginRequest requisicao, CancellationToken cancellationToken = default);
}
