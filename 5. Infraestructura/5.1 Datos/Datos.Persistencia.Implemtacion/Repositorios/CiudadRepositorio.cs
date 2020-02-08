using Datos.Persistencia.Core;
using Datos.Persistencia.Repositorios.Clases;
using Dominio.Contratos;
using Dominio.Core.Entidades;

namespace Datos.Persistencia.Implementacion.Repositorios
{
	public class CiudadRepositorio : RepositorioBase<Ciudad>, ICiudadRepositorio
	{
		public CiudadRepositorio(IContexto unidadDeTrabajo) : base(unidadDeTrabajo) { }
	}
}
