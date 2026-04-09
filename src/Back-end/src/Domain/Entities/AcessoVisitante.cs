using SmartSindico.Domain.Exceptions;

namespace SmartSindico.Domain.Entities;

public class AcessoVisitante
{
    private AcessoVisitante() { }

    public int Id { get; private set; }
    public int IdVisitante { get; private set; }
    public int IdApartamento { get; private set; }
    public DateTime DataHoraEntrada { get; private set; }
    public DateTime? DataHoraSaida { get; private set; }
    public string Observacao { get; private set; } = string.Empty;
    public Visitante? Visitante { get; private set; }

    public static AcessoVisitante RegistrarEntrada(int idVisitante, int idApartamento, int idUsuarioApartamento, int idUsuarioPorteiro, int tipoAcesso, int motivoVisita, string observacao)
    {
        return new AcessoVisitante
        {
            IdVisitante = idVisitante,
            IdApartamento = idApartamento,
            DataHoraEntrada = DateTime.UtcNow,
            Observacao = observacao 
        };
    }

    public void RegistrarSaida() => DataHoraSaida = DateTime.UtcNow;
}