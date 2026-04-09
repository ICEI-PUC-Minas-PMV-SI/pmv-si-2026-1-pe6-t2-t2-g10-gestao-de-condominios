using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Security;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.Services;

public class AutenticacaoService : IAutenticacaoService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IValidator<LoginRequest> _loginValidator;

    public AutenticacaoService(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IValidator<LoginRequest> loginValidator)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _loginValidator = loginValidator;
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

    private AutenticacaoResponse CriarResposta(SmartSindico.Domain.Entities.Usuario usuario)
    {
        var (token, expiraEmUtc) = _tokenService.Generate(usuario);

        return new AutenticacaoResponse
        {
            Token = token,
            ExpiraEmUtc = expiraEmUtc,
            Usuario = ParaRespostaPerfil(usuario)
        };
    }

    private static PerfilUsuarioResponse ParaRespostaPerfil(SmartSindico.Domain.Entities.Usuario usuario)
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
