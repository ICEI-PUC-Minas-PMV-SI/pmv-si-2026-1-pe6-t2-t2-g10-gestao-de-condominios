using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Security;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IValidator<CadastroRequest> _cadastroValidator;

    public UsuarioService(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        IValidator<CadastroRequest> cadastroValidator)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _cadastroValidator = cadastroValidator;
    }

    public async Task<Result<UsuarioResponse>> CadastrarAsync(CadastroRequest requisicao, CancellationToken cancellationToken = default)
    {
        var validacao = await _cadastroValidator.ValidateAsync(requisicao, cancellationToken);
        if (!validacao.IsValid)
        {
            return Result<UsuarioResponse>.ValidationFailure(validacao.Errors);
        }

        var email = Email.Criar(requisicao.Email);
        var cpf = Cpf.Criar(requisicao.Cpf);

        if (await _usuarioRepository.EmailExisteAsync(email.Value, cancellationToken))
        {
            return Result<UsuarioResponse>.Failure(
                "Este e-mail ja esta cadastrado.",
                "EMAIL_ALREADY_EXISTS",
                ErrorType.Conflict);
        }

        if (await _usuarioRepository.CpfExisteAsync(cpf.Value, cancellationToken))
        {
            return Result<UsuarioResponse>.Failure(
                "Este CPF ja esta cadastrado.",
                "CPF_ALREADY_EXISTS",
                ErrorType.Conflict);
        }

        var usuario = Usuario.Criar(
            requisicao.Nome,
            email,
            _passwordHasher.Hash(requisicao.Senha),
            cpf,
            requisicao.Perfil,
            requisicao.IdApartamento,
            requisicao.Telefone);

        await _usuarioRepository.AdicionarAsync(usuario, cancellationToken);
        return Result<UsuarioResponse>.Success(ParaResposta(usuario));
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
