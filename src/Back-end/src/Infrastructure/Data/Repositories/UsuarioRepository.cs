using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Infrastructure.Data.Repositories;

public sealed class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _dbContext;

    public UsuarioRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Usuario>> ObterTodosAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Usuarios
            .AsNoTracking()
            .OrderBy(usuario => usuario.Nome)
            .ToListAsync(cancellationToken);
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
