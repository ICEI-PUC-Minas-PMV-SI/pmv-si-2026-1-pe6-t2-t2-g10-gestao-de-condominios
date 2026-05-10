using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Infrastructure.Data.Repositories;

public sealed class ComunicadoRepository : IComunicadoRepository
{
    private readonly AppDbContext _dbContext;

    public ComunicadoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<Comunicado> Items, int TotalItems, int Page)> ObterAtivosPaginadosAsync(
        bool? ativo,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Comunicado> query = _dbContext.Comunicados
            .AsNoTracking()
            .Include(comunicado => comunicado.Autor);

        if (ativo.HasValue)
        {
            query = query.Where(comunicado => comunicado.Ativo == ativo.Value);
        }

        query = query
            .OrderByDescending(comunicado => comunicado.Ativo)
            .ThenByDescending(comunicado => comunicado.Destaque)
            .ThenByDescending(comunicado => comunicado.DataPublicacao);

        var totalItems = await query.CountAsync(cancellationToken);
        var totalPages = totalItems == 0
            ? 1
            : (int)Math.Ceiling(totalItems / (double)pageSize);
        var currentPage = Math.Min(Math.Max(page, 1), totalPages);
        var items = await query
            .Skip((currentPage - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalItems, currentPage);
    }

    public async Task<Comunicado?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Comunicados
            .AsNoTracking()
            .Include(comunicado => comunicado.Autor)
            .FirstOrDefaultAsync(comunicado => comunicado.Id == id, cancellationToken);
    }

    public async Task AdicionarAsync(Comunicado comunicado, CancellationToken cancellationToken = default)
    {
        await _dbContext.Comunicados.AddAsync(comunicado, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AtualizarAsync(Comunicado comunicado, CancellationToken cancellationToken = default)
    {
        _dbContext.Comunicados.Update(comunicado);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
