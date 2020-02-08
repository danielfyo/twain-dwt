using System.ComponentModel.DataAnnotations;
namespace Dominio.Core.Entidades
{
    public class Departamento
    {
        public int DepartamentoId { get; set; }
        public string CodigoDepartamento { get; set; }
        public string Nombre { get; set; }
        public virtual Pais Pais { get; set; }
        public int PaisId { get; set; }
    }
}
