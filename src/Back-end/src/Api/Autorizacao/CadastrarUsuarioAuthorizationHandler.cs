using Microsoft.AspNetCore.Authorization;
using SmartSindico.Application.DTOs.Autenticacao;

namespace SmartSindico.Api.Autorizacao;

public sealed class CadastrarUsuarioRequirement : IAuthorizationRequirement
{
}

public sealed class CadastrarUsuarioAuthorizationHandler : AuthorizationHandler<CadastrarUsuarioRequirement, CadastroRequest>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CadastrarUsuarioRequirement requirement,
        CadastroRequest resource)
    {
        if (context.User.IsInRole(PerfisAutorizacao.Sindico))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Funcionario) && resource.Perfil.ToString() == PerfisAutorizacao.Morador)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
