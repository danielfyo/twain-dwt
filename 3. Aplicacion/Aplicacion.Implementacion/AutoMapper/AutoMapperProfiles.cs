
using Aplicacion.Core.Dtos;
using AutoMapper;
using Dominio.Core.Entidades;

namespace Aplicacion.Implementacion.AutoMapper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateProfiles();
        }

        private void CreateProfiles()
        {
            CreateMap<PaisDto, Pais>();
            CreateMap<Pais, PaisDto>();
            
            CreateMap<DepartamentoDto, Departamento>();
            CreateMap<Departamento, DepartamentoDto>();

            CreateMap<CiudadDto, Ciudad>();
        }
    }
}
