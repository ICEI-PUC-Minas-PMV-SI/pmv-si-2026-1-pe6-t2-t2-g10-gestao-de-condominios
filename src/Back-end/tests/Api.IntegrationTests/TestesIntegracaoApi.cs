using System.Net;
using System.Net.Http.Json;
using SmartSindico.Api.IntegrationTests.Infraestrutura;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Api.IntegrationTests;

public class TestesIntegracaoApi
{
    [Fact]
    public async Task Entrar_QuandoCredenciaisForemValidas_DeveRetornarToken()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();

        var requisicao = new LoginRequest
        {
            Email = "sindico@teste.com",
            Senha = "123456"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/autenticacao/entrar", requisicao);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var conteudo = await response.Content.ReadFromJsonAsync<AutenticacaoResponse>();
        Assert.NotNull(conteudo);
        Assert.False(string.IsNullOrWhiteSpace(conteudo!.Token));
        Assert.Equal(factory.UsuarioIdSindico, conteudo.Usuario.Id);
    }

    [Fact]
    public async Task ListarUsuarios_QuandoNaoAutenticado_DeveRetornarUnauthorized()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();

        // Act
        var response = await client.GetAsync("/api/usuarios");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CadastrarUsuario_QuandoFuncionarioTentarCadastrarSindico_DeveRetornarForbidden()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();
        client.DefaultRequestHeaders.Authorization = new("Bearer", await AutenticarAsync(client, "funcionario@teste.com", "123456"));

        var requisicao = new CadastroRequest
        {
            Nome = "Novo Sindico",
            Email = "novo.sindico@teste.com",
            Senha = "123456",
            Cpf = "44444444444",
            Telefone = "31999990004",
            Perfil = PerfilUsuario.Sindico,
            IdApartamento = 102
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/usuarios", requisicao);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ObterUsuarioPorId_QuandoMoradorConsultarOutroUsuario_DeveRetornarForbidden()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();
        client.DefaultRequestHeaders.Authorization = new("Bearer", await AutenticarAsync(client, "morador@teste.com", "123456"));

        // Act
        var response = await client.GetAsync($"/api/usuarios/{factory.UsuarioIdFuncionario}");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AtualizarStatus_QuandoFuncionarioAtualizarMorador_DeveRetornarOk()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();
        client.DefaultRequestHeaders.Authorization = new("Bearer", await AutenticarAsync(client, "funcionario@teste.com", "123456"));

        var requisicao = new AtualizacaoStatusUsuarioRequest { Ativo = false };

        // Act
        var response = await client.PatchAsJsonAsync($"/api/usuarios/{factory.UsuarioIdMorador}/ativo", requisicao);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var conteudo = await response.Content.ReadFromJsonAsync<UsuarioResponse>();
        Assert.NotNull(conteudo);
        Assert.False(conteudo!.Ativo);
    }

    [Fact]
    public async Task CriarComunicado_QuandoMoradorTentarCriar_DeveRetornarForbidden()
    {
        // Arrange
        await using var factory = new ApiWebApplicationFactory();
        await factory.InicializarAsync();
        using var client = factory.CriarClient();
        client.DefaultRequestHeaders.Authorization = new("Bearer", await AutenticarAsync(client, "morador@teste.com", "123456"));

        var requisicao = new CriacaoComunicadoRequest
        {
            Titulo = "Aviso",
            Conteudo = "Conteudo do aviso.",
            Destaque = true
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/comunicados", requisicao);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private static async Task<string> AutenticarAsync(HttpClient client, string email, string senha)
    {
        var response = await client.PostAsJsonAsync("/api/autenticacao/entrar", new LoginRequest
        {
            Email = email,
            Senha = senha
        });

        response.EnsureSuccessStatusCode();
        var conteudo = await response.Content.ReadFromJsonAsync<AutenticacaoResponse>();

        return conteudo!.Token;
    }
}
