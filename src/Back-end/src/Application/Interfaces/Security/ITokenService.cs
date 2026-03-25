using SmartSindico.Domain.Entities;

namespace SmartSindico.Application.Interfaces.Security;

public interface ITokenService
{
    (string Token, DateTime ExpiraEmUtc) Generate(Usuario usuario);
}
