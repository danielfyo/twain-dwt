namespace Aplicacion.Core.Dtos
{
    public class DepartamentoDto
    {
        public int DepartamentoId { get; set; }
        public string CodigoDepartamento { get; set; }
        public string Nombre { get; set; }
        public virtual PaisDto Pais { get; set; }
        public int PaisId { get; set; }
    }
}
