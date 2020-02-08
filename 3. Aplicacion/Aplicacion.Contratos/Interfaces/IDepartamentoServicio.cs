using Aplicacion.Core.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplicacion.Contratos
{
	public interface IDepartamentoServicio
	{
		Task<DepartamentoDto> Registrar(DepartamentoDto dto);
		Task<bool> Actualizar(DepartamentoDto dto);
		Task<DepartamentoDto> Consultar(DepartamentoDto dto);
		Task<IEnumerable<DepartamentoDto>> ListarTodo();
		Task<DepartamentoDto> ObtenerPorId(int id);
		Task<bool> Eliminar(int id);
	}
}
