namespace SmartSindico.Application.DTOs.Apartamentos;

public class ApartamentoRequest
{
    public string Numero { get; set; } = string.Empty;
    public string Bloco { get; set; } = string.Empty;
    public int Andar { get; set; }
    public string Tipo { get; set; } = string.Empty;
}