using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Api.Controllers;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.UnitTests.Controllers;

public class TestesComunicadoController
{
    private readonly Mock<IComunicadoService> _comunicadoServiceMock;

    public TestesComunicadoController()
    {
        _comunicadoServiceMock = new Mock<IComunicadoService>();
    }

    [Fact]
    public void Controller_DeveExigirAutenticacao()
    {
        // Arrange
        var atributo = typeof(ComunicadoController).GetCustomAttribute<AuthorizeAttribute>();

        // Act

        // Assert
        Assert.NotNull(atributo);
    }

    [Fact]
    public void Criar_DeveExigirRolesDeFuncionarioOuSindico()
    {
        // Arrange
        var metodo = typeof(ComunicadoController).GetMethod(nameof(ComunicadoController.Criar));

        // Act
        var atributo = metodo!.GetCustomAttribute<AuthorizeAttribute>();

        // Assert
        Assert.NotNull(atributo);
        Assert.Equal(PerfisAutorizacao.FuncionarioOuSindico, atributo!.Roles);
    }

    [Fact]
    public void AtualizarStatus_DeveExigirRolesDeFuncionarioOuSindico()
    {
        // Arrange
        var metodo = typeof(ComunicadoController).GetMethod(nameof(ComunicadoController.AtualizarStatus));

        // Act
        var atributo = metodo!.GetCustomAttribute<AuthorizeAttribute>();

        // Assert
        Assert.NotNull(atributo);
        Assert.Equal(PerfisAutorizacao.FuncionarioOuSindico, atributo!.Roles);
    }

    [Fact]
    public async Task Criar_QuandoUsuarioAtualNaoEstiverNoToken_DeveRetornarNaoAutorizado()
    {
        // Arrange
        var controller = CriarController(idUsuario: null, perfil: PerfilUsuario.Funcionario);
        var requisicao = CriarRequisicaoCriacao();

        // Act
        var resultado = await controller.Criar(requisicao, CancellationToken.None);

        // Assert
        Assert.IsType<UnauthorizedResult>(resultado);

        _comunicadoServiceMock.Verify(
            s => s.CriarAsync(It.IsAny<int>(), It.IsAny<CriacaoComunicadoRequest>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Criar_QuandoUsuarioAtualEstiverNoToken_DeveRetornarCriado()
    {
        // Arrange
        var controller = CriarController(idUsuario: 20, perfil: PerfilUsuario.Funcionario);
        var requisicao = CriarRequisicaoCriacao();
        var resposta = CriarRespostaComunicado();

        _comunicadoServiceMock
            .Setup(s => s.CriarAsync(20, requisicao, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<ComunicadoResponse>.Success(resposta));

        // Act
        var resultado = await controller.Criar(requisicao, CancellationToken.None);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(resultado);
        Assert.Equal(nameof(ComunicadoController.ObterPorId), createdAtActionResult.ActionName);

        var response = Assert.IsType<ComunicadoResponse>(createdAtActionResult.Value);
        Assert.Equal(5, response.Id);

        _comunicadoServiceMock.Verify(
            s => s.CriarAsync(20, requisicao, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task AtualizarStatus_QuandoServiceRetornarSucesso_DeveRetornarOk()
    {
        // Arrange
        var controller = CriarController(idUsuario: 20, perfil: PerfilUsuario.Funcionario);
        var requisicao = new AtualizacaoStatusComunicadoRequest { Ativo = false };
        var resposta = CriarRespostaComunicado() with { Ativo = false };

        _comunicadoServiceMock
            .Setup(s => s.AtualizarStatusAsync(5, requisicao, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<ComunicadoResponse>.Success(resposta));

        // Act
        var resultado = await controller.AtualizarStatus(5, requisicao, CancellationToken.None);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(resultado);
        Assert.Equal(StatusCodes.Status200OK, objectResult.StatusCode);

        var response = Assert.IsType<ComunicadoResponse>(objectResult.Value);
        Assert.False(response.Ativo);
    }

    private ComunicadoController CriarController(int? idUsuario, PerfilUsuario? perfil)
    {
        var controller = new ComunicadoController(_comunicadoServiceMock.Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = CriarUsuarioLogado(idUsuario, perfil)
            }
        };

        return controller;
    }

    private static ClaimsPrincipal CriarUsuarioLogado(int? idUsuario, PerfilUsuario? perfil)
    {
        var claims = new List<Claim>();

        if (idUsuario.HasValue)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, idUsuario.Value.ToString()));
        }

        if (perfil.HasValue)
        {
            claims.Add(new Claim(ClaimTypes.Role, perfil.Value.ToString()));
        }

        var identity = new ClaimsIdentity(claims, "TestAuth");
        return new ClaimsPrincipal(identity);
    }

    private static CriacaoComunicadoRequest CriarRequisicaoCriacao() => new()
    {
        Titulo = "Nova portaria",
        Conteudo = "A portaria funcionara em horario especial.",
        Destaque = true
    };

    private static ComunicadoResponse CriarRespostaComunicado() => new()
    {
        Id = 5,
        IdAutor = 20,
        NomeAutor = "Funcionario Teste",
        Titulo = "Nova portaria",
        Conteudo = "A portaria funcionara em horario especial.",
        DataPublicacao = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc),
        Ativo = true,
        Destaque = true
    };
}
