using SmartSindico.Domain.Exceptions;
using SmartSindico.Domain.Enums;
using SmartSindico.Domain.ValueObjects;

namespace SmartSindico.Domain.Entities;

public class AreaComum
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public int Capacidade { get; set; }
    public bool Ativa { get; set; }
    public bool RequerAprovacao { get; set; }
}
