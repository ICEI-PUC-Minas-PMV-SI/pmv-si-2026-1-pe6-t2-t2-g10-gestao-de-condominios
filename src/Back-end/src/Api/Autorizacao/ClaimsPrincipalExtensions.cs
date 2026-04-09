using System.Security.Claims;

namespace SmartSindico.Api.Autorizacao;

public static class ClaimsPrincipalExtensions
{
    public static bool TryGetUsuarioAtualId(this ClaimsPrincipal user, out int idUsuario)
    {
        var userIdText = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub");
        return int.TryParse(userIdText, out idUsuario);
    }
}
