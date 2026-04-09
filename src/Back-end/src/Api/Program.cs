using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
using SmartSindico.Api.Autorizacao;
using SmartSindico.Application;
using SmartSindico.Api.Middleware;
using SmartSindico.Infrastructure.DependencyInjection;

namespace SmartSindico.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Configuration
            .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
            .AddJsonFile(
                $"appsettings.{builder.Environment.EnvironmentName}.local.json",
                optional: true,
                reloadOnChange: true);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "SmartSindico.Api",
                Version = "v1"
            });

            var bearerScheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Informe o token JWT no formato: Bearer {token}",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            };

            options.AddSecurityDefinition("Bearer", bearerScheme);
            options.AddSecurityRequirement(_ => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", null, null)] = []
            });
        });
        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(builder.Configuration);
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(
                PoliticasAutorizacao.CadastrarUsuario,
                policy => policy.RequireAuthenticatedUser().AddRequirements(new CadastrarUsuarioRequirement()));

            options.AddPolicy(
                PoliticasAutorizacao.VisualizarUsuario,
                policy => policy.RequireAuthenticatedUser().AddRequirements(new VisualizarUsuarioRequirement()));

            options.AddPolicy(
                PoliticasAutorizacao.AtualizarStatusUsuario,
                policy => policy.RequireAuthenticatedUser().AddRequirements(new AtualizarStatusUsuarioRequirement()));
        });
        builder.Services.AddSingleton<IAuthorizationHandler, CadastrarUsuarioAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, VisualizarUsuarioAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, AtualizarStatusUsuarioAuthorizationHandler>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Local"))
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartSindico.Api v1");
                options.RoutePrefix = string.Empty;
            });
        }

        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        await app.RunAsync();
    }
}
