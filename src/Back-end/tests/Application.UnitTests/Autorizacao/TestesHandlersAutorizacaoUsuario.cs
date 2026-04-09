using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Application.UnitTests.Autorizacao;

public class TestesHandlersAutorizacaoUsuario
{
    [Fact]
    public async Task CadastrarUsuario_QuandoFuncionarioCadastrarMorador_DeveAutorizar()
    {
        // Arrange
        var handler = new CadastrarUsuarioAuthorizationHandler();
        var requirement = new CadastrarUsuarioRequirement();
        var usuario = CriarUsuarioLogado(20, PerfilUsuario.Funcionario);
        var recurso = new CadastroRequest { Perfil = PerfilUsuario.Morador };
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task CadastrarUsuario_QuandoFuncionarioCadastrarSindico_DeveNegar()
    {
        // Arrange
        var handler = new CadastrarUsuarioAuthorizationHandler();
        var requirement = new CadastrarUsuarioRequirement();
        var usuario = CriarUsuarioLogado(20, PerfilUsuario.Funcionario);
        var recurso = new CadastroRequest { Perfil = PerfilUsuario.Sindico };
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task VisualizarUsuario_QuandoMoradorVisualizarProprioCadastro_DeveAutorizar()
    {
        // Arrange
        var handler = new VisualizarUsuarioAuthorizationHandler();
        var requirement = new VisualizarUsuarioRequirement();
        var usuario = CriarUsuarioLogado(10, PerfilUsuario.Morador);
        var recurso = CriarUsuarioResponse(10, PerfilUsuario.Morador);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task VisualizarUsuario_QuandoMoradorVisualizarOutroCadastro_DeveNegar()
    {
        // Arrange
        var handler = new VisualizarUsuarioAuthorizationHandler();
        var requirement = new VisualizarUsuarioRequirement();
        var usuario = CriarUsuarioLogado(10, PerfilUsuario.Morador);
        var recurso = CriarUsuarioResponse(11, PerfilUsuario.Morador);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task VisualizarUsuario_QuandoFuncionarioVisualizarMorador_DeveAutorizar()
    {
        // Arrange
        var handler = new VisualizarUsuarioAuthorizationHandler();
        var requirement = new VisualizarUsuarioRequirement();
        var usuario = CriarUsuarioLogado(20, PerfilUsuario.Funcionario);
        var recurso = CriarUsuarioResponse(30, PerfilUsuario.Morador);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task AtualizarStatusUsuario_QuandoFuncionarioAtualizarMorador_DeveAutorizar()
    {
        // Arrange
        var handler = new AtualizarStatusUsuarioAuthorizationHandler();
        var requirement = new AtualizarStatusUsuarioRequirement();
        var usuario = CriarUsuarioLogado(20, PerfilUsuario.Funcionario);
        var recurso = CriarUsuarioResponse(30, PerfilUsuario.Morador);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task AtualizarStatusUsuario_QuandoFuncionarioAtualizarFuncionario_DeveNegar()
    {
        // Arrange
        var handler = new AtualizarStatusUsuarioAuthorizationHandler();
        var requirement = new AtualizarStatusUsuarioRequirement();
        var usuario = CriarUsuarioLogado(20, PerfilUsuario.Funcionario);
        var recurso = CriarUsuarioResponse(21, PerfilUsuario.Funcionario);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task AtualizarStatusUsuario_QuandoSindicoAtualizarProprioStatus_DeveAutorizar()
    {
        // Arrange
        var handler = new AtualizarStatusUsuarioAuthorizationHandler();
        var requirement = new AtualizarStatusUsuarioRequirement();
        var usuario = CriarUsuarioLogado(40, PerfilUsuario.Sindico);
        var recurso = CriarUsuarioResponse(40, PerfilUsuario.Sindico);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task AtualizarStatusUsuario_QuandoSindicoAtualizarMorador_DeveNegar()
    {
        // Arrange
        var handler = new AtualizarStatusUsuarioAuthorizationHandler();
        var requirement = new AtualizarStatusUsuarioRequirement();
        var usuario = CriarUsuarioLogado(40, PerfilUsuario.Sindico);
        var recurso = CriarUsuarioResponse(30, PerfilUsuario.Morador);
        var context = new AuthorizationHandlerContext([requirement], usuario, recurso);

        // Act
        await handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
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
