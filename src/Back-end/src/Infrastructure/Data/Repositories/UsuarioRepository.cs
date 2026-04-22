using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Infrastructure.Data.Repositories;

public sealed class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _dbContext;

    public UsuarioRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<Usuario> Items, int TotalItems, int Page)> ObterVisiveisPaginadosAsync(
        PerfilUsuario perfilAtual,
        int idUsuarioAtual,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Usuarios.AsNoTracking();

        query = perfilAtual switch
        {
            PerfilUsuario.Sindico => query,
            PerfilUsuario.Funcionario => query.Where(usuario =>
                usuario.Id == idUsuarioAtual || usuario.Perfil != PerfilUsuario.Sindico),
            _ => query.Where(usuario => usuario.Id == idUsuarioAtual)
        };

        var orderedQuery = query.OrderBy(usuario => usuario.Nome);

        if (string.IsNullOrWhiteSpace(search))
        {
            var totalItems = await orderedQuery.CountAsync(cancellationToken);
            var totalPages = totalItems == 0
                ? 1
                : (int)Math.Ceiling(totalItems / (double)pageSize);
            var currentPage = Math.Min(Math.Max(page, 1), totalPages);
            var items = await orderedQuery
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalItems, currentPage);
        }

        var term = search.Trim();
        var termDigits = new string(term.Where(char.IsDigit).ToArray());
        var hasApartmentId = int.TryParse(term, out var apartmentId);
        var visibleUsers = await orderedQuery.ToListAsync(cancellationToken);

        var filteredUsers = visibleUsers
            .Where(usuario =>
                usuario.Nome.Contains(term, StringComparison.OrdinalIgnoreCase)
                || usuario.Email.Value.Contains(term, StringComparison.OrdinalIgnoreCase)
                || (!string.IsNullOrWhiteSpace(termDigits) && usuario.Cpf.Value.Contains(termDigits, StringComparison.Ordinal))
                || (!string.IsNullOrWhiteSpace(usuario.Telefone)
                    && usuario.Telefone.Contains(term, StringComparison.OrdinalIgnoreCase))
                || (hasApartmentId && usuario.IdApartamento == apartmentId))
            .ToList();

        var filteredTotalItems = filteredUsers.Count;
        var filteredTotalPages = filteredTotalItems == 0
            ? 1
            : (int)Math.Ceiling(filteredTotalItems / (double)pageSize);
        var filteredCurrentPage = Math.Min(Math.Max(page, 1), filteredTotalPages);
        var pagedFilteredUsers = filteredUsers
            .Skip((filteredCurrentPage - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return (pagedFilteredUsers, filteredTotalItems, filteredCurrentPage);
    }

    public async Task<Usuario?> ObterPorEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var emailValue = Email.Criar(email);

        return await _dbContext.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(usuario => usuario.Email == emailValue, cancellationToken);
    }

    public async Task<Usuario?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(usuario => usuario.Id == id, cancellationToken);
    }

    public async Task<bool> EmailExisteAsync(string email, CancellationToken cancellationToken = default)
    {
        var emailValue = Email.Criar(email);

        return await _dbContext.Usuarios
            .AnyAsync(usuario => usuario.Email == emailValue, cancellationToken);
    }

    public async Task<bool> CpfExisteAsync(string cpf, CancellationToken cancellationToken = default)
    {
        var cpfValue = Cpf.Criar(cpf);

        return await _dbContext.Usuarios
            .AnyAsync(usuario => usuario.Cpf == cpfValue, cancellationToken);
    }

    public async Task AdicionarAsync(Usuario usuario, CancellationToken cancellationToken = default)
    {
        await _dbContext.Usuarios.AddAsync(usuario, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AtualizarAsync(Usuario usuario, CancellationToken cancellationToken = default)
    {
        _dbContext.Usuarios.Update(usuario);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
