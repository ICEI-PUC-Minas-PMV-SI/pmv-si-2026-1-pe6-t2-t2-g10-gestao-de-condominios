using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SmartSindico.Api;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;
using SmartSindico.Infrastructure.Data;
using SmartSindico.Infrastructure.Security;

namespace SmartSindico.Api.IntegrationTests.Infraestrutura;

public sealed class ApiWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"SmartSindicoTests-{Guid.NewGuid():N}";

    public int UsuarioIdSindico { get; private set; }
    public int UsuarioIdFuncionario { get; private set; }
    public int UsuarioIdMorador { get; private set; }

    public HttpClient CriarClient()
    {
        return CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://localhost")
        });
    }

    public async Task InicializarAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordHasher = new PasswordHasher();

        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();

        var sindico = Usuario.Criar(
            "Sindico Teste",
            Email.Criar("sindico@teste.com"),
            passwordHasher.Hash("123456"),
            Cpf.Criar("33333333333"),
            PerfilUsuario.Sindico,
            idApartamento: 1,
            telefone: "31999990003");

        var funcionario = Usuario.Criar(
            "Funcionario Teste",
            Email.Criar("funcionario@teste.com"),
            passwordHasher.Hash("123456"),
            Cpf.Criar("22222222222"),
            PerfilUsuario.Funcionario,
            idApartamento: null,
            telefone: "31999990002");

        var morador = Usuario.Criar(
            "Morador Teste",
            Email.Criar("morador@teste.com"),
            passwordHasher.Hash("123456"),
            Cpf.Criar("11111111111"),
            PerfilUsuario.Morador,
            idApartamento: 101,
            telefone: "31999990001");

        context.Usuarios.AddRange(sindico, funcionario, morador);
        await context.SaveChangesAsync();

        UsuarioIdSindico = sindico.Id;
        UsuarioIdFuncionario = funcionario.Id;
        UsuarioIdMorador = morador.Id;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Host=localhost;Database=smartsindico_tests;Username=test;Password=test",
                ["Jwt:Issuer"] = "SmartSindico.Api.Tests",
                ["Jwt:Audience"] = "SmartSindico.Client.Tests",
                ["Jwt:Key"] = "SmartSindico-chave-super-secreta-para-testes-1234567890",
                ["Jwt:ExpirationMinutes"] = "60"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.RemoveAll<AppDbContext>();
            services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();

            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
                options.UseInternalServiceProvider(serviceProvider);
            });
        });
    }
}
