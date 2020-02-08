using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Aplicacion.Core.Dtos;
using Dominio.Core.Entidades;
using Aplicacion.Contratos;
using Dominio.Contratos;

namespace Aplicacion.Implementacion.Servicios
{
    public class DepartamentoServicio : IDepartamentoServicio
    {
        public readonly IDepartamentoRepositorio _repositorio;
        public readonly IPaisRepositorio _repositorioPais;
        private readonly IMapper _mapper;

        public DepartamentoServicio(
            IDepartamentoRepositorio repositorioIn,
            IPaisRepositorio repositorioPaisIn, IMapper mapper)
        {
            _repositorioPais = repositorioPaisIn;
            _repositorio = repositorioIn;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DepartamentoDto>> ListarTodo()
        {
            var lista = await _repositorio.ListarTodo();
            foreach (var item in lista)
            {
                item.Pais = await _repositorioPais.ObtenerPorId(item.PaisId);
            }
            return _mapper.Map<IEnumerable<Departamento>, IEnumerable<DepartamentoDto>>(lista
                .OrderBy(x => x.DepartamentoId)
                );
        }

        public async Task<DepartamentoDto> Registrar(DepartamentoDto dto)
        {
            var response = await _repositorio.Agregar(_mapper.Map<DepartamentoDto, Departamento>(dto));
            return _mapper.Map<Departamento,DepartamentoDto>(response);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _repositorio.Eliminar(id);
        }

        public async Task<DepartamentoDto> Consultar(DepartamentoDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Actualizar(DepartamentoDto dto)
        {
            return await _repositorio.Actualizar(_mapper.Map<DepartamentoDto, Departamento>(dto));
        }

        public async Task<DepartamentoDto> ObtenerPorId(int id)
        {
            return _mapper.Map<Departamento, DepartamentoDto>(await _repositorio.ObtenerPorId(id));
        }
    }
}
