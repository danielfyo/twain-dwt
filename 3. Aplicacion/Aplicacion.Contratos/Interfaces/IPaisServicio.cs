using Aplicacion.Core.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplicacion.Contratos
{
	public interface IPaisServicio
	{
		Task<PaisDto> Registrar(PaisDto dto);
		Task<bool> Actualizar(PaisDto dto);
		Task<PaisDto> Consultar(PaisDto dto);
		Task<IEnumerable<PaisDto>> ListarTodo();
		Task<PaisDto> ObtenerPorId(int id);
		Task<bool> Eliminar(int id);
	}
}
