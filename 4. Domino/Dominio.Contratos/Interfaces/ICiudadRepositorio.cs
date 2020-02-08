using Dominio.Core.Agregados;
using Dominio.Core.Entidades;
using System;

namespace Dominio.Contratos
{
	public interface ICiudadRepositorio : IRepositorioBase<Ciudad>, IDisposable
	{
	}
}
