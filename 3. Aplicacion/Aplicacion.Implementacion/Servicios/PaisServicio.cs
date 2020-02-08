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
    public class PaisServicio : IPaisServicio
    {
        public readonly IPaisRepositorio _repositorio;
        private readonly IMapper _mapper;

        public PaisServicio(IPaisRepositorio repositorioIn, IMapper mapper)
        {
            _repositorio = repositorioIn;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PaisDto>> ListarTodo()
        {
            var lista = await _repositorio.ListarTodo();

            return _mapper.Map<IEnumerable<Pais>, IEnumerable<PaisDto>>(lista
                .OrderBy(x => x.PaisId)
                );
        }

        public async Task<PaisDto> Registrar(PaisDto dto)
        {
            var response = await _repositorio.Agregar(_mapper.Map<PaisDto, Pais>(dto));
            return _mapper.Map<Pais,PaisDto>(response);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _repositorio.Eliminar(id);
        }

        public async Task<PaisDto> Consultar(PaisDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Actualizar(PaisDto dto)
        {
            return await _repositorio.Actualizar(_mapper.Map<PaisDto, Pais>(dto));
        }

        public async Task<PaisDto> ObtenerPorId(int id)
        {
            return _mapper.Map<Pais, PaisDto>(await _repositorio.ObtenerPorId(id));
        }
    }
}
