using Datos.Persistencia.Core;
using Datos.Persistencia.Repositorios.Clases;
using Dominio.Contratos;
using Dominio.Core.Entidades;

namespace Datos.Persistencia.Implementacion.Repositorios
{
	public class PaisRepositorio : RepositorioBase<Pais>, IPaisRepositorio
	{
		public PaisRepositorio(IContexto unidadDeTrabajo) : base(unidadDeTrabajo) { }
	}
}
