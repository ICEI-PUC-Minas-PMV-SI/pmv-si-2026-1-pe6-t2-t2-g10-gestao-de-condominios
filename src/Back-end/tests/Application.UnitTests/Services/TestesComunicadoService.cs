using Moq;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Application.Services;
using SmartSindico.Application.Validators;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.UnitTests.Services;

public class TestesComunicadoService
{
    private readonly Mock<IComunicadoRepository> _repositorioComunicadoMock;
    private readonly Mock<IUsuarioRepository> _repositorioUsuarioMock;
    private readonly Mock<IValidator<CriacaoComunicadoRequest>> _validadorCriacaoMock;
    private readonly ComunicadoService _servico;

    public TestesComunicadoService()
    {
        _repositorioComunicadoMock = new Mock<IComunicadoRepository>();
        _repositorioUsuarioMock = new Mock<IUsuarioRepository>();
        _validadorCriacaoMock = new Mock<IValidator<CriacaoComunicadoRequest>>();

        _validadorCriacaoMock
            .Setup(v => v.ValidateAsync(It.IsAny<CriacaoComunicadoRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _servico = new ComunicadoService(
            _repositorioComunicadoMock.Object,
            _repositorioUsuarioMock.Object,
            _validadorCriacaoMock.Object);
    }

    [Fact]
    public async Task CriarAsync_QuandoValidacaoFalhar_DeveRetornarFalhaDeValidacao()
    {
        // Arrange
        var validacaoInvalida = new SmartSindico.Application.Validators.ValidationResult();
        validacaoInvalida.AddError("Titulo", "Titulo e obrigatorio.");

        _validadorCriacaoMock
            .Setup(v => v.ValidateAsync(It.IsAny<CriacaoComunicadoRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validacaoInvalida);

        // Act
        var resultado = await _servico.CriarAsync(1, CriarRequisicaoCriacaoComunicado());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Validation, resultado.FailureType);

        _repositorioComunicadoMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Comunicado>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task CriarAsync_QuandoAutorEstiverInativo_DeveRetornarProibido()
    {
        // Arrange
        var autor = CriarUsuario(ativo: false);

        _repositorioUsuarioMock
            .Setup(r => r.ObterPorIdAsync(10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(autor);

        // Act
        var resultado = await _servico.CriarAsync(10, CriarRequisicaoCriacaoComunicado());

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.Forbidden, resultado.FailureType);
        Assert.Equal("AUTHOR_INACTIVE", resultado.ErrorCode);

        _repositorioComunicadoMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Comunicado>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task CriarAsync_QuandoRequisicaoForValida_DeveCriarComunicadoEAssociarAutor()
    {
        // Arrange
        var autor = CriarUsuario(nome: "Carlos Souza");
        var requisicao = CriarRequisicaoCriacaoComunicado();
        Comunicado? comunicadoAdicionado = null;

        _repositorioUsuarioMock
            .Setup(r => r.ObterPorIdAsync(12, It.IsAny<CancellationToken>()))
            .ReturnsAsync(autor);

        _repositorioComunicadoMock
            .Setup(r => r.AdicionarAsync(It.IsAny<Comunicado>(), It.IsAny<CancellationToken>()))
            .Callback<Comunicado, CancellationToken>((comunicado, _) => comunicadoAdicionado = comunicado)
            .Returns(Task.CompletedTask);

        // Act
        var resultado = await _servico.CriarAsync(12, requisicao);

        // Assert
        Assert.True(resultado.IsSuccess);
        Assert.NotNull(resultado.Value);
        Assert.Equal("Carlos Souza", resultado.Value!.NomeAutor);
        Assert.True(resultado.Value.Destaque);
        Assert.NotNull(comunicadoAdicionado);
        Assert.Equal("Nova portaria", comunicadoAdicionado!.Titulo);
        Assert.Equal("A portaria funcionara em horario especial.", comunicadoAdicionado.Conteudo);
        Assert.True(comunicadoAdicionado.Destaque);

        _repositorioComunicadoMock.Verify(
            r => r.AdicionarAsync(It.IsAny<Comunicado>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task AtualizarStatusAsync_QuandoComunicadoNaoExistir_DeveRetornarNaoEncontrado()
    {
        // Arrange
        _repositorioComunicadoMock
            .Setup(r => r.ObterPorIdAsync(99, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Comunicado?)null);

        // Act
        var resultado = await _servico.AtualizarStatusAsync(99, new AtualizacaoStatusComunicadoRequest { Ativo = false });

        // Assert
        Assert.False(resultado.IsSuccess);
        Assert.Equal(ErrorType.NotFound, resultado.FailureType);
        Assert.Equal("NOTICE_NOT_FOUND", resultado.ErrorCode);
    }

    private static CriacaoComunicadoRequest CriarRequisicaoCriacaoComunicado() => new()
    {
        Titulo = "Nova portaria",
        Conteudo = "A portaria funcionara em horario especial.",
        Destaque = true
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
