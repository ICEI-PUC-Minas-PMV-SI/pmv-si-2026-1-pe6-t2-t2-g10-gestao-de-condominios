using Moq;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Results;
using SmartSindico.Application.Services;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Application.UnitTests.Services;

public class TestesUsuarioService
{
    private readonly Mock<IUsuarioRepository> _repositorioUsuarioMock;
    private readonly UsuarioService _servico;

    public TestesUsuarioService()
    {
        _repositorioUsuarioMock = new Mock<IUsuarioRepository>();
        _servico = new UsuarioService(_repositorioUsuarioMock.Object);
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
