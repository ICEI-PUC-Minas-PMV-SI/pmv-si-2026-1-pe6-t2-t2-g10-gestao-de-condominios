using Moq;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Security;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Application.Services;
using SmartSindico.Application.Validators;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.UnitTests.Services;

public class TestesAutenticacaoService
{
    private readonly Mock<IUsuarioRepository> _repositorioUsuarioMock;
    private readonly Mock<IPasswordHasher> _hashSenhaMock;
    private readonly Mock<ITokenService> _servicoTokenMock;
    private readonly Mock<IValidator<CadastroRequest>> _validadorCadastroMock;
    private readonly Mock<IValidator<LoginRequest>> _validadorLoginMock;
    private readonly AutenticacaoService _servico;

    public TestesAutenticacaoService()
    {
        _repositorioUsuarioMock = new Mock<IUsuarioRepository>();
        _hashSenhaMock = new Mock<IPasswordHasher>();
        _servicoTokenMock = new Mock<ITokenService>();
        _validadorCadastroMock = new Mock<IValidator<CadastroRequest>>();
        _validadorLoginMock = new Mock<IValidator<LoginRequest>>();

        _validadorCadastroMock
            .Setup(v => v.ValidateAsync(It.IsAny<CadastroRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _validadorLoginMock
            .Setup(v => v.ValidateAsync(It.IsAny<LoginRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _servico = new AutenticacaoService(
            _repositorioUsuarioMock.Object,
            _hashSenhaMock.Object,
            _servicoTokenMock.Object,
            _validadorCadastroMock.Object,
            _validadorLoginMock.Object);
    }

    [Fact]
    public async Task CadastrarAsync_QuandoValidacaoFalhar_DeveRetornarFalhaDeValidacao()
    {
        // Arrange
        var validacaoInvalida = new SmartSindico.Application.Validators.ValidationResult();
        validacaoInvalida.AddError("Email", "E-mail invalido.");

        _validadorCadastroMock
            .Setup(v => v.ValidateAsync(It.IsAny<CadastroRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validacaoInvalida);

        // Act
        var resultado = await _servico.CadastrarAsync(CriarRequisicaoCadastro());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Validation, resultado.FailureType);
        Assert.Equal("VALIDATION_ERROR", resultado.ErrorCode);
        Assert.Single(resultado.ValidationErrors);

        _repositorioUsuarioMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task CadastrarAsync_QuandoEmailJaExistir_DeveRetornarConflito()
    {
        // Arrange
        _repositorioUsuarioMock
            .Setup(r => r.EmailExisteAsync("maria@teste.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var resultado = await _servico.CadastrarAsync(CriarRequisicaoCadastro());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Conflict, resultado.FailureType);
        Assert.Equal("EMAIL_ALREADY_EXISTS", resultado.ErrorCode);

        _repositorioUsuarioMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task CadastrarAsync_QuandoRequisicaoForValida_DevePersistirUsuarioERetornarToken()
    {
        // Arrange
        var requisicao = CriarRequisicaoCadastro();
        Usuario? usuarioAdicionado = null;
        var expiracao = new DateTime(2030, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        _repositorioUsuarioMock
            .Setup(r => r.EmailExisteAsync("maria@teste.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _repositorioUsuarioMock
            .Setup(r => r.CpfExisteAsync("12345678901", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _hashSenhaMock
            .Setup(h => h.Hash("senha123"))
            .Returns("hashed::senha123");

        _repositorioUsuarioMock
            .Setup(r => r.AdicionarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()))
            .Callback<Usuario, CancellationToken>((usuario, _) => usuarioAdicionado = usuario)
            .Returns(Task.CompletedTask);

        _servicoTokenMock
            .Setup(t => t.Generate(It.IsAny<Usuario>()))
            .Returns(("jwt-token", expiracao));

        // Act
        var resultado = await _servico.CadastrarAsync(requisicao);

        // Assert
        Assert.True(resultado.IsSuccess);
        Assert.NotNull(resultado.Value);
        Assert.Equal("jwt-token", resultado.Value!.Token);
        Assert.Equal("Maria Silva", resultado.Value.Usuario.Nome);
        Assert.NotNull(usuarioAdicionado);
        Assert.Equal("Maria Silva", usuarioAdicionado!.Nome);
        Assert.Equal("maria@teste.com", usuarioAdicionado.Email.Value);
        Assert.Equal("12345678901", usuarioAdicionado.Cpf.Value);
        Assert.Equal("hashed::senha123", usuarioAdicionado.SenhaHash);

        _repositorioUsuarioMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Once);

        _hashSenhaMock.Verify(h => h.Hash("senha123"), Times.Once);
        _servicoTokenMock.Verify(t => t.Generate(It.Is<Usuario>(u => u == usuarioAdicionado)), Times.Once);
    }

    [Fact]
    public async Task EntrarAsync_QuandoCredenciaisForemValidas_DeveAtualizarUltimoLoginERetornarToken()
    {
        // Arrange
        var usuario = CriarUsuario();
        var expiracao = new DateTime(2030, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        _repositorioUsuarioMock
            .Setup(r => r.ObterPorEmailAsync("maria@teste.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _hashSenhaMock
            .Setup(h => h.Verify("senha123", "hashed::senha123"))
            .Returns(true);

        _servicoTokenMock
            .Setup(t => t.Generate(usuario))
            .Returns(("token-login", expiracao));

        // Act
        var resultado = await _servico.EntrarAsync(CriarRequisicaoLogin());

        // Assert
        Assert.True(resultado.IsSuccess);
        Assert.NotNull(resultado.Value);
        Assert.Equal("token-login", resultado.Value!.Token);
        Assert.NotNull(usuario.DataUltimoLogin);

        _hashSenhaMock.Verify(h => h.Verify("senha123", "hashed::senha123"), Times.Once);
        _repositorioUsuarioMock.Verify(
            r => r.AtualizarAsync(It.Is<Usuario>(u => u == usuario && u.DataUltimoLogin.HasValue), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task EntrarAsync_QuandoUsuarioEstiverInativo_DeveRetornarProibido()
    {
        // Arrange
        var usuario = CriarUsuario(ativo: false);

        _repositorioUsuarioMock
            .Setup(r => r.ObterPorEmailAsync("maria@teste.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        _hashSenhaMock
            .Setup(h => h.Verify("senha123", "hashed::senha123"))
            .Returns(true);

        // Act
        var resultado = await _servico.EntrarAsync(CriarRequisicaoLogin());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Forbidden, resultado.FailureType);
        Assert.Equal("USER_INACTIVE", resultado.ErrorCode);

        _repositorioUsuarioMock.Verify(
            r => r.AtualizarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Never);

        _servicoTokenMock.Verify(t => t.Generate(It.IsAny<Usuario>()), Times.Never);
    }

    private static CadastroRequest CriarRequisicaoCadastro() => new()
    {
        Nome = "Maria Silva",
        Email = "maria@teste.com",
        Senha = "senha123",
        Cpf = "12345678901",
        Perfil = PerfilUsuario.Sindico,
        IdApartamento = 101,
        Telefone = "31999999999"
    };

    private static LoginRequest CriarRequisicaoLogin() => new()
    {
        Email = "maria@teste.com",
        Senha = "senha123"
    };

    private static Usuario CriarUsuario(
        string nome = "Maria Silva",
        string email = "maria@teste.com",
        string cpf = "12345678901",
        PerfilUsuario perfil = PerfilUsuario.Sindico,
        bool ativo = true)
    {
        var usuario = Usuario.Criar(
            nome,
            Email.Criar(email),
            "hashed::senha123",
            Cpf.Criar(cpf),
            perfil,
            101,
            "31999999999",
            new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));

        if (!ativo)
        {
            usuario.DefinirStatus(false);
        }

        return usuario;
    }
}
