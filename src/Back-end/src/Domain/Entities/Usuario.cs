using SmartSindico.Domain.Exceptions;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Domain.Entities;

public class Usuario
{
    private Usuario()
    {
    }

    public int Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public Email Email { get; private set; } = null!;
    public string SenhaHash { get; private set; } = string.Empty;
    public Cpf Cpf { get; private set; } = null!;
    public string? Telefone { get; private set; }
    public PerfilUsuario Perfil { get; private set; }
    public int? IdApartamento { get; private set; }
    public bool Ativo { get; private set; } = true;
    public DateTime DataCriacao { get; private set; } = DateTime.UtcNow;
    public DateTime? DataUltimoLogin { get; private set; }

    public ICollection<Comunicado> ComunicadosCriados { get; private set; } = new List<Comunicado>();

    public static Usuario Criar(
        string nome,
        Email email,
        string senhaHash,
        Cpf cpf,
        PerfilUsuario perfil,
        int? idApartamento,
        string? telefone = null,
        DateTime? dataCriacaoUtc = null)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new DomainException("Nome é obrigatório.");
        }

        if (nome.Trim().Length > 120)
        {
            throw new DomainException("Nome deve ter no máximo 120 caracteres.");
        }

        if (string.IsNullOrWhiteSpace(senhaHash))
        {
            throw new DomainException("SenhaHash á obrigatório.");
        }

        if (!Enum.IsDefined(perfil))
        {
            throw new DomainException("Perfil inválido.");
        }

        return new Usuario
        {
            Nome = nome.Trim(),
            Email = email,
            SenhaHash = senhaHash,
            Cpf = cpf,
            Telefone = NormalizarTelefone(telefone),
            Perfil = perfil,
            IdApartamento = idApartamento,
            Ativo = true,
            DataCriacao = dataCriacaoUtc ?? DateTime.UtcNow
        };
    }

    public void RegistrarLogin(DateTime dataLogin)
    {
        if (!Ativo)
        {
            throw new DomainException("Nao e possivel registrar login de usuario inativo.");
        }

        DataUltimoLogin = dataLogin;
    }

    public void DefinirStatus(bool ativo)
    {
        Ativo = ativo;
    }

    public void AtualizarDados(
        string nome,
        Email email,
        string? senhaHash,
        PerfilUsuario perfil,
        int? idApartamento,
        string? telefone,
        bool ativo)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new DomainException("Nome é obrigatório.");
        }

        if (nome.Trim().Length > 120)
        {
            throw new DomainException("Nome deve ter no máximo 120 caracteres.");
        }

        if (!Enum.IsDefined(perfil))
        {
            throw new DomainException("Perfil inválido.");
        }

        if (senhaHash is not null && string.IsNullOrWhiteSpace(senhaHash))
        {
            throw new DomainException("SenhaHash inválido.");
        }

        Nome = nome.Trim();
        Email = email;
        if (!string.IsNullOrWhiteSpace(senhaHash))
        {
            SenhaHash = senhaHash;
        }

        Telefone = NormalizarTelefone(telefone);
        Perfil = perfil;
        IdApartamento = perfil == PerfilUsuario.Morador ? idApartamento : null;
        Ativo = ativo;
    }

    private static string? NormalizarTelefone(string? telefone)
    {
        return string.IsNullOrWhiteSpace(telefone) ? null : telefone.Trim();
    }
}
