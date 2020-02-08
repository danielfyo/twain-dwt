using Dominio.Core.Agregados;
using Dominio.Core.Entidades.Comparendos;
using Microsoft.EntityFrameworkCore;
using System;

namespace Datos.Persistencia.Core.Interfaces
{
    public interface IContextoComparendos : IUnidadTrabajo, IDisposable
    {
        #region DbSet Comparendos
        DbSet<AgenteTransito> AgenteTransito { get; }
        DbSet<Alcoholemia> Alcoholemia { get; }
        DbSet<Comparendera> Comparendera { get; }
        DbSet<ComparenderaDetalle> ComparenderaDetalle { get; }
        DbSet<Comparendo> Comparendo { get; }
        DbSet<EstadoComparendo> EstadoComparendo { get; }
        DbSet<Infraccion> Infraccion { get; }
        DbSet<Infractor> Infractor { get; }
        DbSet<LicenciaConduccion> LicenciaConduccion { get; }
        DbSet<RangoComparendo> RangoComparendo { get; }
        DbSet<TipoComparendo> TipoComparendo { get; }
        #endregion

    }
}
