using Dominio.Core.Agregados;
using Dominio.Core.Entidades.Runt;
using Microsoft.EntityFrameworkCore;
using System;

namespace Datos.Persistencia.Core.Interfaces
{
    public interface IContextoRunt : IUnidadTrabajo, IDisposable
    {
        #region DbSet Runt
        DbSet<CarroceriaClase> CarroceriaClase { get; }
        DbSet<CarroceriaModalidad> CarroceriaModalidad { get; }
        DbSet<CiudadExtranjera> CiudadExtranjera { get; }
        DbSet<ClaseCarroceriaModalidad> ClaseCarroceriaModalidad { get; }
        DbSet<ClaseMaquinaria> ClaseMaquinaria { get; }
        DbSet<ClaseVehiculo> ClaseVehiculo { get; }
        DbSet<CodigoCarroceriaClase> CodigoCarroceriaClase { get; }
        DbSet<Color> Color { get; }
        DbSet<DatoTecnico> DatoTecnico { get; }
        DbSet<DireccionTerritorial> DireccionTerritorial { get; }
        DbSet<DocumentoProcedencia> DocumentoProcedencia { get; }
        DbSet<EmpresaGPS> EmpresaGPS { get; }
        DbSet<EntidadJuridica> EntidadJuridica { get; }
        DbSet<HomologacionNitGarantiaMobiliaria> HomologacionNitGarantiaMobiliaria { get; }
        DbSet<Linea> Linea { get; }
        DbSet<LineaMaquinaria> LineaMaquinaria { get; }
        DbSet<LineaRemolque> LineaRemolque { get; }
        DbSet<Marca> Marca { get; }
        DbSet<MarcaMaquinaria> MarcaMaquinaria { get; }
        DbSet<MarcaRemolque> MarcaRemolque { get; }
        DbSet<MedidaCautelar> MedidaCautelar { get; }
        DbSet<ModalidadServicio> ModalidadServicio { get; }
        DbSet<ModalidadTransporte> ModalidadTransporte { get; }
        DbSet<MotivoCancelacion> MotivoCancelacion { get; }
        DbSet<NivelServicio> NivelServicio { get; }
        DbSet<OrganismoTransito> OrganismoTransito { get; }
        DbSet<OrigenRegistro> OrigenRegistro { get; }
        DbSet<ProcesoMedidaCautelar> ProcesoMedidaCautelar { get; }
        DbSet<Puerto> Puerto { get; }
        DbSet<PuertoOT> PuertoOT { get; }
        DbSet<RangoLlanta> RangoLlanta { get; }
        DbSet<RangosClase> RangosClase { get; }
        DbSet<SubpartidaArancelaria> SubpartidaArancelaria { get; }
        DbSet<TipoCarroceria> TipoCarroceria { get; }
        DbSet<TipoCombustible> TipoCombustible { get; }
        DbSet<TipoMaquinaria> TipoMaquinaria { get; }
        DbSet<TipoMaquinariaClase> TipoMaquinariaClase { get; }
        DbSet<TipoMedida> TipoMedida { get; }
        DbSet<TipoRodaje> TipoRodaje { get; }
        DbSet<TipoServicio> TipoServicio { get; }
        DbSet<ValorClase> ValorClase { get; }
        DbSet<ValorDatoTecnico> ValorDatoTecnico { get; }
        #endregion

    }
}
