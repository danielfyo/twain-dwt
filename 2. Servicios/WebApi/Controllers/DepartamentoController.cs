using Aplicacion.Contratos;
using Aplicacion.Core.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApi.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentoController : ControllerBase
    {
        private readonly IDepartamentoServicio _servicio;

        public DepartamentoController(IDepartamentoServicio servicio)
        {
            _servicio = servicio;
        }
        [AllowAnonymous]
        [HttpGet("ListarTodo")]
        public async Task<IEnumerable<DepartamentoDto>> ListarTodo()
        {
            return await _servicio.ListarTodo();
        }
        [AllowAnonymous]
        [HttpGet("ObtenerPorId/{id}")]
        public async Task<DepartamentoDto> ObtenerPorId(int id)
        {
            return await _servicio.ObtenerPorId(id);
        }

        [HttpPut("Actualizar")]
        public async Task<bool> Actualizar(DepartamentoDto dto)
        {
            return await _servicio.Actualizar(dto);
        }

        [HttpPost("Registrar")]
        public async Task<ActionResult> Registrar(DepartamentoDto dto)
        {
            var response = await _servicio.Registrar(dto);
            return Ok(response);
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<bool> Eliminar(int id)
        {
            return await _servicio.Eliminar(id);
        }
    }
}
