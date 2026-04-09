using Moq;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Usuarios;
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

public class TestesUsuarioService
{
    private readonly Mock<IUsuarioRepository> _repositorioUsuarioMock;
    private readonly Mock<IPasswordHasher> _hashSenhaMock;
    private readonly Mock<IValidator<CadastroRequest>> _validadorCadastroMock;
    private readonly UsuarioService _servico;

    public TestesUsuarioService()
    {
        _repositorioUsuarioMock = new Mock<IUsuarioRepository>();
        _hashSenhaMock = new Mock<IPasswordHasher>();
        _validadorCadastroMock = new Mock<IValidator<CadastroRequest>>();

        _validadorCadastroMock
            .Setup(v => v.ValidateAsync(It.IsAny<CadastroRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _servico = new UsuarioService(
            _repositorioUsuarioMock.Object,
            _hashSenhaMock.Object,
            _validadorCadastroMock.Object);
    }

    [Fact]
    public async Task CadastrarAsync_QuandoValidacaoFalhar_DeveRetornarFalhaDeValidacao()
    {
        // Arrange
        var validacaoInvalida = new ValidationResult();
        validacaoInvalida.AddError("Email", "E-mail inválido.");

        _validadorCadastroMock
            .Setup(v => v.ValidateAsync(It.IsAny<CadastroRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validacaoInvalida);

        // Act
        var resultado = await _servico.CadastrarAsync(CriarRequisicaoCadastro());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Validation, resultado.FailureType);
        Assert.Equal("VALIDATION_ERROR", resultado.ErrorCode);

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
    public async Task CadastrarAsync_QuandoRequisicaoForValida_DevePersistirUsuarioERetornarResposta()
    {
        // Arrange
        var requisicao = CriarRequisicaoCadastro();
        Usuario? usuarioAdicionado = null;

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

        // Act
        var resultado = await _servico.CadastrarAsync(requisicao);

        // Assert
        Assert.True(resultado.IsSuccess);
        Assert.NotNull(resultado.Value);
        Assert.Equal("Maria Silva", resultado.Value!.Nome);
        Assert.Equal("maria@teste.com", resultado.Value.Email);
        Assert.Equal("12345678901", resultado.Value.Cpf);
        Assert.Equal(nameof(PerfilUsuario.Morador), resultado.Value.Perfil);
        Assert.NotNull(usuarioAdicionado);
        Assert.Equal("hashed::senha123", usuarioAdicionado!.SenhaHash);

        _repositorioUsuarioMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Once);

        _hashSenhaMock.Verify(h => h.Hash("senha123"), Times.Once);
    }

    [Fact]
    public async Task AtualizarStatusAsync_QuandoUsuarioNaoExistir_DeveRetornarNaoEncontrado()
    {
        // Arrange
        _repositorioUsuarioMock
            .Setup(r => r.ObterPorIdAsync(77, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Usuario?)null);

        // Act
        var resultado = await _servico.AtualizarStatusAsync(77, new AtualizacaoStatusUsuarioRequest { Ativo = false });

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.NotFound, resultado.FailureType);
        Assert.Equal("USER_NOT_FOUND", resultado.ErrorCode);

        _repositorioUsuarioMock.Verify(
            r => r.AtualizarAsync(It.IsAny<Usuario>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task AtualizarStatusAsync_QuandoUsuarioExistir_DeveAtualizarStatusERetornarResposta()
    {
        // Arrange
        var usuario = CriarUsuario();

        _repositorioUsuarioMock
            .Setup(r => r.ObterPorIdAsync(15, It.IsAny<CancellationToken>()))
            .ReturnsAsync(usuario);

        // Act
        var resultado = await _servico.AtualizarStatusAsync(15, new AtualizacaoStatusUsuarioRequest { Ativo = false });

        // Assert
        Assert.True(resultado.IsSuccess);
        Assert.NotNull(resultado.Value);
        Assert.False(usuario.Ativo);
        Assert.False(resultado.Value!.Ativo);

        _repositorioUsuarioMock.Verify(
            r => r.AtualizarAsync(It.Is<Usuario>(u => u == usuario && !u.Ativo), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private static CadastroRequest CriarRequisicaoCadastro() => new()
    {
        Nome = "Maria Silva",
        Email = "maria@teste.com",
        Senha = "senha123",
        Cpf = "12345678901",
        Perfil = PerfilUsuario.Morador,
        IdApartamento = 101,
        Telefone = "31999999999"
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
