using Microsoft.AspNetCore.Authorization;
using SmartSindico.Application.DTOs.Usuarios;

namespace SmartSindico.Api.Autorizacao;

public sealed class AtualizarStatusUsuarioRequirement : IAuthorizationRequirement
{
}

public sealed class AtualizarStatusUsuarioAuthorizationHandler : AuthorizationHandler<AtualizarStatusUsuarioRequirement, UsuarioResponse>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AtualizarStatusUsuarioRequirement requirement,
        UsuarioResponse resource)
    {
        if (!context.User.TryGetUsuarioAtualId(out var idUsuarioAtual))
        {
            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Funcionario) && resource.Perfil == PerfisAutorizacao.Morador)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Sindico)
            && (resource.Id == idUsuarioAtual || resource.Perfil == PerfisAutorizacao.Funcionario))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
