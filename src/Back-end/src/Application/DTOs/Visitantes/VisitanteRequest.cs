using System;
using System.Collections.Generic;
using System.Text;

namespace SmartSindico.Application.DTOs.Visitantes
{
    public class VisitanteRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty; // Aqui é string para o Swagger aceitar
        public string Telefone { get; set; } = string.Empty;
        public string Observacao { get; set; } = string.Empty;
        public int IdApartamento { get; set; }
    }
}
