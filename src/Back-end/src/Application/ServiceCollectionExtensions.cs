using Microsoft.Extensions.DependencyInjection;
using SmartSindico.Application.Services;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Autenticacao;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Validators;

namespace SmartSindico.Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAutenticacaoService, AutenticacaoService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IComunicadoService, ComunicadoService>();
        services.AddTransient<IValidator<CadastroRequest>, CadastroRequestValidator>();
        services.AddTransient<IValidator<AtualizacaoUsuarioRequest>, AtualizacaoUsuarioRequestValidator>();
        services.AddTransient<IValidator<LoginRequest>, LoginRequestValidator>();
        services.AddTransient<IValidator<CriacaoComunicadoRequest>, CriacaoComunicadoRequestValidator>();

        return services;
    }
}
