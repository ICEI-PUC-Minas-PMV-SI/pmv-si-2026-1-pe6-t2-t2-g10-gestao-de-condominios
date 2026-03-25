using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuarioService(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    public async Task<Result<IReadOnlyList<UsuarioResponse>>> ObterTodosAsync(CancellationToken cancellationToken = default)
    {
        var usuarios = await _usuarioRepository.ObterTodosAsync(cancellationToken);
        return Result<IReadOnlyList<UsuarioResponse>>.Success(usuarios.Select(ParaResposta).ToList());
    }

    public async Task<Result<UsuarioResponse>> ObterPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObterPorIdAsync(id, cancellationToken);
        if (usuario is null)
        {
            return Result<UsuarioResponse>.Failure(
                "Usuario nao encontrado.",
                "USER_NOT_FOUND",
                ErrorType.NotFound);
        }

        return Result<UsuarioResponse>.Success(ParaResposta(usuario));
    }

    public async Task<Result<UsuarioResponse>> AtualizarStatusAsync(int id, AtualizacaoStatusUsuarioRequest requisicao, CancellationToken cancellationToken = default)
    {
        var usuario = await _usuarioRepository.ObterPorIdAsync(id, cancellationToken);
        if (usuario is null)
        {
            return Result<UsuarioResponse>.Failure(
                "Usuario nao encontrado.",
                "USER_NOT_FOUND",
                ErrorType.NotFound);
        }

        usuario.DefinirStatus(requisicao.Ativo);
        await _usuarioRepository.AtualizarAsync(usuario, cancellationToken);

        return Result<UsuarioResponse>.Success(ParaResposta(usuario));
    }

    private static UsuarioResponse ParaResposta(Usuario usuario)
    {
        return new UsuarioResponse
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email.Value,
            Cpf = usuario.Cpf.Value,
            Telefone = usuario.Telefone,
            Perfil = usuario.Perfil.ToString(),
            IdApartamento = usuario.IdApartamento,
            Ativo = usuario.Ativo,
            DataCriacao = usuario.DataCriacao,
            DataUltimoLogin = usuario.DataUltimoLogin
        };
    }
}
