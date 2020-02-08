using System.ComponentModel.DataAnnotations;
namespace Dominio.Core.Entidades
{
    public class Pais
    {
        public int PaisId { get; set; }

        [MaxLength(50)] 
        public string Nombre { get; set; }
    }
}
