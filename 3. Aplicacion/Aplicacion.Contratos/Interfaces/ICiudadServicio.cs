using Aplicacion.Core.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplicacion.Contratos
{
	public interface ICiudadServicio
	{
		Task<CiudadDto> Registrar(CiudadDto dto);
		Task<bool> Actualizar(CiudadDto dto);
		Task<CiudadDto> Consultar(CiudadDto dto);
		Task<IEnumerable<CiudadDto>> ListarTodo();
		Task<CiudadDto> ObtenerPorId(int id);
		Task<bool> Eliminar(int id);
	}
}
