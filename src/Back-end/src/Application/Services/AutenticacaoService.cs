using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Security;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.Services;

public class AutenticacaoService : IAutenticacaoService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IValidator<CadastroRequest> _cadastroValidator;
    private readonly IValidator<LoginRequest> _loginValidator;

    public AutenticacaoService(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IValidator<CadastroRequest> cadastroValidator,
        IValidator<LoginRequest> loginValidator)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _cadastroValidator = cadastroValidator;
        _loginValidator = loginValidator;
    }

    public async Task<Result<AutenticacaoResponse>> CadastrarAsync(CadastroRequest requisicao, CancellationToken cancellationToken = default)
    {
        var validacao = await _cadastroValidator.ValidateAsync(requisicao, cancellationToken);
        if (!validacao.IsValid)
        {
            return Result<AutenticacaoResponse>.ValidationFailure(validacao.Errors);
        }

        var email = Email.Criar(requisicao.Email);
        var cpf = Cpf.Criar(requisicao.Cpf);

        if (await _usuarioRepository.EmailExisteAsync(email.Value, cancellationToken))
        {
            return Result<AutenticacaoResponse>.Failure(
                "Este e-mail ja esta cadastrado.",
                "EMAIL_ALREADY_EXISTS",
                ErrorType.Conflict);
        }

        if (await _usuarioRepository.CpfExisteAsync(cpf.Value, cancellationToken))
        {
            return Result<AutenticacaoResponse>.Failure(
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
        return Result<AutenticacaoResponse>.Success(CriarResposta(usuario));
    }

    public async Task<Result<AutenticacaoResponse>> EntrarAsync(LoginRequest requisicao, CancellationToken cancellationToken = default)
    {
        var validacao = await _loginValidator.ValidateAsync(requisicao, cancellationToken);
        if (!validacao.IsValid)
        {
            return Result<AutenticacaoResponse>.ValidationFailure(validacao.Errors);
        }

        var email = Email.Criar(requisicao.Email);
        var usuario = await _usuarioRepository.ObterPorEmailAsync(email.Value, cancellationToken);

        if (usuario is null || !_passwordHasher.Verify(requisicao.Senha, usuario.SenhaHash))
        {
            return Result<AutenticacaoResponse>.Failure(
                "Credenciais invalidas.",
                "INVALID_CREDENTIALS",
                ErrorType.Unauthorized);
        }

        if (!usuario.Ativo)
        {
            return Result<AutenticacaoResponse>.Failure(
                "Usuario inativo.",
                "USER_INACTIVE",
                ErrorType.Forbidden);
        }

        usuario.RegistrarLogin(DateTime.UtcNow);
        await _usuarioRepository.AtualizarAsync(usuario, cancellationToken);

        return Result<AutenticacaoResponse>.Success(CriarResposta(usuario));
    }

    private AutenticacaoResponse CriarResposta(Usuario usuario)
    {
        var (token, expiraEmUtc) = _tokenService.Generate(usuario);

        return new AutenticacaoResponse
        {
            Token = token,
            ExpiraEmUtc = expiraEmUtc,
            Usuario = ParaRespostaPerfil(usuario)
        };
    }

    private static PerfilUsuarioResponse ParaRespostaPerfil(Usuario usuario)
    {
        return new PerfilUsuarioResponse
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email.Value,
            Telefone = usuario.Telefone,
            Perfil = usuario.Perfil.ToString(),
            IdApartamento = usuario.IdApartamento
        };
    }
}
