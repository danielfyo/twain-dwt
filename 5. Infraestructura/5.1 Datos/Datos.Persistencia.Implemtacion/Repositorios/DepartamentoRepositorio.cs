using Datos.Persistencia.Core;
using Datos.Persistencia.Repositorios.Clases;
using Dominio.Contratos;
using Dominio.Core.Entidades;

namespace Datos.Persistencia.Implementacion.Repositorios
{
	public class DepartamentoRepositorio : RepositorioBase<Departamento>, IDepartamentoRepositorio
	{
		public DepartamentoRepositorio(IContexto unidadDeTrabajo) : base(unidadDeTrabajo) { }
	}
}
