using SmartSindico.Domain.Enums;

namespace SmartSindico.Api.Autorizacao;

public static class PerfisAutorizacao
{
    public const string Morador = nameof(PerfilUsuario.Morador);
    public const string Funcionario = nameof(PerfilUsuario.Funcionario);
    public const string Sindico = nameof(PerfilUsuario.Sindico);
    public const string FuncionarioOuSindico = $"{Funcionario},{Sindico}";
}
