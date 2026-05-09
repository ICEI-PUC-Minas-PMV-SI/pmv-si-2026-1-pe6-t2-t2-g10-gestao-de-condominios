using System;
using System.Collections.Generic;
using System.Text;

namespace SmartSindico.Application.DTOs.Acessos
{
    public class RegistroEntradaRequest
    {
        public int IdUsuarioApartamento { get; set; }
        public int IdUsuarioPorteiro { get; set; }
        public int TipoAcesso { get; set; }
        public int MotivoVisita { get; set; }
        public string? Observacao { get; set; }
    }
}
