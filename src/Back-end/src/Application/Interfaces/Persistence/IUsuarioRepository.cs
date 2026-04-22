using SmartSindico.Domain.Enums;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Application.Interfaces.Persistence;

public interface IUsuarioRepository
{
    Task<(IReadOnlyList<Usuario> Items, int TotalItems, int Page)> ObterVisiveisPaginadosAsync(
        PerfilUsuario perfilAtual,
        int idUsuarioAtual,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
    Task<Usuario?> ObterPorEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Usuario?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> EmailExisteAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> CpfExisteAsync(string cpf, CancellationToken cancellationToken = default);
    Task AdicionarAsync(Usuario usuario, CancellationToken cancellationToken = default);
    Task AtualizarAsync(Usuario usuario, CancellationToken cancellationToken = default);
}
