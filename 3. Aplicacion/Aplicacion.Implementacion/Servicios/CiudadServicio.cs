using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Dominio.Contratos;
using Aplicacion.Core.Dtos;
using Dominio.Core.Entidades;
using Aplicacion.Contratos;

namespace Aplicacion.Implementacion.Servicios
{
    public class CiudadServicio : ICiudadServicio
    {
        public readonly ICiudadRepositorio _repositorio;
        public readonly IDepartamentoRepositorio _departamentoRepositorio;
        private readonly IMapper _mapper;

        public CiudadServicio(
            ICiudadRepositorio repositorioIn,
            IDepartamentoRepositorio departamentoRepositorioIn, IMapper mapper)
        {
            _departamentoRepositorio = departamentoRepositorioIn;
            _repositorio = repositorioIn;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CiudadDto>> ListarTodo()
        {
            var lista = await _repositorio.ListarTodo();
            foreach (var item in lista)
            {
                var departamento = await _departamentoRepositorio.ObtenerPorId(item.DepartamentoId);
                item.Departamento = departamento;
            }
            return _mapper.Map<IEnumerable<Ciudad>, IEnumerable<CiudadDto>>(lista
                .OrderBy(x => x.CiudadId)
                );
        }

        public async Task<CiudadDto> Registrar(CiudadDto dto)
        {
            var response = await _repositorio.Agregar(_mapper.Map<CiudadDto, Ciudad>(dto));
            return _mapper.Map<Ciudad,CiudadDto>(response);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _repositorio.Eliminar(id);
        }

        public async Task<CiudadDto> Consultar(CiudadDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Actualizar(CiudadDto dto)
        {
            return await _repositorio.Actualizar(_mapper.Map<CiudadDto, Ciudad>(dto));
        }

        public async Task<CiudadDto> ObtenerPorId(int id)
        {
            return _mapper.Map<Ciudad, CiudadDto>(await _repositorio.ObtenerPorId(id));
        }
    }
}
