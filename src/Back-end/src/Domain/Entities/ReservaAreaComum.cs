using SmartSindico.Domain.Exceptions;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Domain.Entities;

public class ReservaAreaComum
{
    public int Id { get; set; }
    public int IdAreaComum { get; set; }
    public int IdUsuario { get; set; }
    public int IdApartamento { get; set; }
    public DateTime DataHoraInicio { get; set; }
    public DateTime DataHoraFim { get; set; }
    public int Status { get; set; } // 0: Pendente, 1: Aprovado, 2: Negado
    public string? Observacao { get; set; }
    public DateTime DataSolicitacao { get; set; } = DateTime.Now;
    public DateTime? DataAprovacao { get; set; }
    public int? IdUsuarioAprovador { get; set; }
  
 public static ReservaAreaComum RegistrarReserva(int IdAreaComum, int IdUsuario, int IdApartamento, int Status, string observacao)
    {
        return new ReservaAreaComum
        {
            IdAreaComum = IdAreaComum,
            IdUsuario = IdUsuario
            IdApartamento = idApartamento,
            DataSolicitacao = DataSolicitacao,
            Observacao = observacao 
        };
    }
}
