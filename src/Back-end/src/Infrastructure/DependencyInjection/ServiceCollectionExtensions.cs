using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Security;
using SmartSindico.Infrastructure.Security;
using SmartSindico.Infrastructure.Data;
using SmartSindico.Infrastructure.Data.Repositories;

namespace SmartSindico.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSection = configuration.GetRequiredSection(JwtOptions.SectionName);
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("A string de conexao 'DefaultConnection' nao foi encontrada.");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("A string de conexao 'DefaultConnection' nao pode estar vazia.");
        }

        services
            .AddOptions<JwtOptions>()
            .Bind(jwtSection)
            .ValidateDataAnnotations()
            .Validate(
                options => !string.IsNullOrWhiteSpace(options.Issuer)
                    && !string.IsNullOrWhiteSpace(options.Audience)
                    && !string.IsNullOrWhiteSpace(options.Key),
                "A configuracao JWT esta incompleta.")
            .ValidateOnStart();

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure()));

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IConfigureOptions<JwtBearerOptions>, ConfigureJwtBearerOptions>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IComunicadoRepository, ComunicadoRepository>();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        services.AddAuthorization();

        return services;
    }
}
