namespace Aplicacion.Core.Dtos
{
    public class CiudadDto
    {
        public int CiudadId { get; set; }
        public string Nombre { get; set; }
        public string Divipo { get; set; }
        public DepartamentoDto Departamento { get; set; }
        public int DepartamentoId { get; set; }
    }
}
