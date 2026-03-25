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

    public async Task<IReadOnlyList<Comunicado>> ObterAtivosAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Comunicados
            .AsNoTracking()
            .Include(comunicado => comunicado.Autor)
            .Where(comunicado => comunicado.Ativo)
            .OrderByDescending(comunicado => comunicado.Destaque)
            .ThenByDescending(comunicado => comunicado.DataPublicacao)
            .ToListAsync(cancellationToken);
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
