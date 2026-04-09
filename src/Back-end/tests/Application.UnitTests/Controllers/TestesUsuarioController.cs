using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Api.Controllers;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.UnitTests.Controllers;

public class TestesUsuarioController
{
    private readonly Mock<IUsuarioService> _usuarioServiceMock;
    private readonly Mock<IAuthorizationService> _authorizationServiceMock;

    public TestesUsuarioController()
    {
        _usuarioServiceMock = new Mock<IUsuarioService>();
        _authorizationServiceMock = new Mock<IAuthorizationService>();
    }

    [Fact]
    public void Controller_DeveExigirAutenticacaoPorPadrao()
    {
        // Arrange
        var atributo = typeof(UsuarioController).GetCustomAttribute<AuthorizeAttribute>();

        // Act

        // Assert
        Assert.NotNull(atributo);
    }

    [Fact]
    public void Cadastrar_DeveExigirRolesDeFuncionarioOuSindico()
    {
        // Arrange
        var metodo = typeof(UsuarioController).GetMethod(nameof(UsuarioController.Cadastrar));

        // Act
        var atributo = metodo!.GetCustomAttribute<AuthorizeAttribute>();

        // Assert
        Assert.NotNull(atributo);
        Assert.Equal(PerfisAutorizacao.FuncionarioOuSindico, atributo!.Roles);
    }

    [Fact]
    public void ObterTodos_DeveExigirRoleDeSindico()
    {
        // Arrange
        var metodo = typeof(UsuarioController).GetMethod(nameof(UsuarioController.ObterTodos));

        // Act
        var atributo = metodo!.GetCustomAttribute<AuthorizeAttribute>();

        // Assert
        Assert.NotNull(atributo);
        Assert.Equal(PerfisAutorizacao.Sindico, atributo!.Roles);
    }

    [Fact]
    public void AtualizarStatus_DeveExigirRolesDeFuncionarioOuSindico()
    {
        // Arrange
        var metodo = typeof(UsuarioController).GetMethod(nameof(UsuarioController.AtualizarStatus));

        // Act
        var atributo = metodo!.GetCustomAttribute<AuthorizeAttribute>();

        // Assert
        Assert.NotNull(atributo);
        Assert.Equal(PerfisAutorizacao.FuncionarioOuSindico, atributo!.Roles);
    }

    [Fact]
    public async Task Cadastrar_QuandoAutorizacaoFalhar_DeveRetornarProibido()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var requisicao = CriarRequisicaoCadastro(perfil: PerfilUsuario.Sindico);

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                requisicao,
                PoliticasAutorizacao.CadastrarUsuario))
            .ReturnsAsync(AuthorizationResult.Failed());

        // Act
        var resultado = await controller.Cadastrar(requisicao, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status403Forbidden, objectResult.StatusCode);

        var problem = Assert.IsType<ProblemDetails>(objectResult.Value);
        Assert.Equal("Perfil sem permissao para cadastrar este tipo de usuario.", problem.Title);

        _usuarioServiceMock.Verify(
            s => s.CadastrarAsync(It.IsAny<CadastroRequest>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Cadastrar_QuandoAutorizacaoForPermitida_DeveRetornarCriado()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var requisicao = CriarRequisicaoCadastro(perfil: PerfilUsuario.Morador);
        var resposta = CriarUsuarioResponse(id: 10, perfil: PerfilUsuario.Morador);

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                requisicao,
                PoliticasAutorizacao.CadastrarUsuario))
            .ReturnsAsync(AuthorizationResult.Success());

        _usuarioServiceMock
            .Setup(s => s.CadastrarAsync(requisicao, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(resposta));

        // Act
        var resultado = await controller.Cadastrar(requisicao, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status201Created, objectResult.StatusCode);

        var response = Assert.IsType<UsuarioResponse>(objectResult.Value);
        Assert.Equal(10, response.Id);

        _usuarioServiceMock.Verify(
            s => s.CadastrarAsync(requisicao, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task ObterPorId_QuandoAutorizacaoFalhar_DeveRetornarProibido()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var usuario = CriarUsuarioResponse(id: 30, perfil: PerfilUsuario.Morador);

        _usuarioServiceMock
            .Setup(s => s.ObterPorIdAsync(30, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(usuario));

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                usuario,
                PoliticasAutorizacao.VisualizarUsuario))
            .ReturnsAsync(AuthorizationResult.Failed());

        // Act
        var resultado = await controller.ObterPorId(30, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status403Forbidden, objectResult.StatusCode);

        _authorizationServiceMock.Verify(
            s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                usuario,
                PoliticasAutorizacao.VisualizarUsuario),
            Times.Once);
    }

    [Fact]
    public async Task ObterPorId_QuandoAutorizacaoForPermitida_DeveRetornarSucesso()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var usuario = CriarUsuarioResponse(id: 30, perfil: PerfilUsuario.Morador);

        _usuarioServiceMock
            .Setup(s => s.ObterPorIdAsync(30, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(usuario));

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                usuario,
                PoliticasAutorizacao.VisualizarUsuario))
            .ReturnsAsync(AuthorizationResult.Success());

        // Act
        var resultado = await controller.ObterPorId(30, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status200OK, objectResult.StatusCode);
    }

    [Fact]
    public async Task AtualizarStatus_QuandoAutorizacaoFalhar_DeveRetornarProibido()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var usuario = CriarUsuarioResponse(id: 21, perfil: PerfilUsuario.Funcionario);
        var requisicao = new AtualizacaoStatusUsuarioRequest { Ativo = false };

        _usuarioServiceMock
            .Setup(s => s.ObterPorIdAsync(21, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(usuario));

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                usuario,
                PoliticasAutorizacao.AtualizarStatusUsuario))
            .ReturnsAsync(AuthorizationResult.Failed());

        // Act
        var resultado = await controller.AtualizarStatus(21, requisicao, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status403Forbidden, objectResult.StatusCode);

        _usuarioServiceMock.Verify(
            s => s.AtualizarStatusAsync(It.IsAny<int>(), It.IsAny<AtualizacaoStatusUsuarioRequest>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task AtualizarStatus_QuandoAutorizacaoForPermitida_DeveRetornarOk()
    {
        // Arrange
        var controller = CriarController(20, PerfilUsuario.Funcionario);
        var usuario = CriarUsuarioResponse(id: 30, perfil: PerfilUsuario.Morador);
        var requisicao = new AtualizacaoStatusUsuarioRequest { Ativo = false };

        _usuarioServiceMock
            .Setup(s => s.ObterPorIdAsync(30, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(usuario));

        _authorizationServiceMock
            .Setup(s => s.AuthorizeAsync(
                It.IsAny<ClaimsPrincipal>(),
                usuario,
                PoliticasAutorizacao.AtualizarStatusUsuario))
            .ReturnsAsync(AuthorizationResult.Success());

        _usuarioServiceMock
            .Setup(s => s.AtualizarStatusAsync(30, requisicao, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<UsuarioResponse>.Success(usuario with { Ativo = false }));

        // Act
        var resultado = await controller.AtualizarStatus(30, requisicao, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status200OK, objectResult.StatusCode);

        _usuarioServiceMock.Verify(
            s => s.AtualizarStatusAsync(30, requisicao, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private UsuarioController CriarController(int idUsuario, PerfilUsuario perfil)
    {
        var controller = new UsuarioController(_usuarioServiceMock.Object, _authorizationServiceMock.Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = CriarUsuarioLogado(idUsuario, perfil)
            }
        };

        return controller;
    }

    private static ClaimsPrincipal CriarUsuarioLogado(int idUsuario, PerfilUsuario perfil)
    {
        var identity = new ClaimsIdentity(
        [
            new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
            new Claim(ClaimTypes.Role, perfil.ToString())
        ], "TestAuth");

        return new ClaimsPrincipal(identity);
    }

    private static CadastroRequest CriarRequisicaoCadastro(PerfilUsuario perfil) => new()
    {
        Nome = "Maria Silva",
        Email = "maria@teste.com",
        Senha = "123456",
        Cpf = "12345678901",
        Perfil = perfil,
        IdApartamento = 101,
        Telefone = "31999999999"
    };

    private static UsuarioResponse CriarUsuarioResponse(int id, PerfilUsuario perfil) => new()
    {
        Id = id,
        Nome = $"Usuario {id}",
        Email = $"usuario{id}@teste.com",
        Cpf = "12345678901",
        Perfil = perfil.ToString(),
        Ativo = true,
        DataCriacao = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    };
}
