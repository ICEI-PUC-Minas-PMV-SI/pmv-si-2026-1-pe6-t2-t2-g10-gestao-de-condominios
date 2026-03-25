using SmartSindico.Domain.Entities;

namespace SmartSindico.Application.Interfaces.Persistence;

public interface IComunicadoRepository
{
    Task<IReadOnlyList<Comunicado>> ObterAtivosAsync(CancellationToken cancellationToken = default);
    Task<Comunicado?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task AdicionarAsync(Comunicado comunicado, CancellationToken cancellationToken = default);
    Task AtualizarAsync(Comunicado comunicado, CancellationToken cancellationToken = default);
}
