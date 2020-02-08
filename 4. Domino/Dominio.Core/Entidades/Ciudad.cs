using System.ComponentModel.DataAnnotations;

namespace Dominio.Core.Entidades
{
    public class Ciudad
    {
        public int CiudadId { get; set; }

        [MaxLength(10)]
        public string Divipo { get; set; }
        public Departamento Departamento { get; set; }
        public int DepartamentoId { get; set; }

        [MaxLength(50)]
        public string Nombre { get; set; }
    }
}
