using Microsoft.AspNetCore.Authorization;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Domain.Enums;

namespace SmartSindico.Api.Autorizacao;

public sealed record AtualizarUsuarioResource(
    UsuarioResponse UsuarioAlvo,
    AtualizacaoUsuarioRequest Requisicao);

public sealed class AtualizarUsuarioRequirement : IAuthorizationRequirement
{
}

public sealed class AtualizarUsuarioAuthorizationHandler
    : AuthorizationHandler<AtualizarUsuarioRequirement, AtualizarUsuarioResource>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AtualizarUsuarioRequirement requirement,
        AtualizarUsuarioResource resource)
    {
        if (!context.User.TryGetUsuarioAtualId(out var idUsuarioAtual))
        {
            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Sindico))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Funcionario))
        {
            if (resource.UsuarioAlvo.Perfil == PerfisAutorizacao.Sindico
                || resource.Requisicao.Perfil == PerfilUsuario.Sindico)
            {
                return Task.CompletedTask;
            }

            if (resource.UsuarioAlvo.Id == idUsuarioAtual
                || resource.UsuarioAlvo.Perfil == PerfisAutorizacao.Morador
                || resource.UsuarioAlvo.Perfil == PerfisAutorizacao.Funcionario)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        if (context.User.IsInRole(PerfisAutorizacao.Morador)
            && resource.UsuarioAlvo.Id == idUsuarioAtual
            && resource.Requisicao.Perfil.ToString() == resource.UsuarioAlvo.Perfil
            && resource.Requisicao.IdApartamento == resource.UsuarioAlvo.IdApartamento
            && resource.Requisicao.Ativo == resource.UsuarioAlvo.Ativo)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
