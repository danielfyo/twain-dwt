using Dominio.Core.Agregados;
using Dominio.Core.Entidades.Fotodeteccion;
using Microsoft.EntityFrameworkCore;
using System;

namespace Datos.Persistencia.Core.Interfaces
{
    public interface IContextoFotodeteccion : IUnidadTrabajo, IDisposable
    {
        #region DbSet Fotodeteccion
        DbSet<CertificadoDispositivo> CertificadoCalibracion { get; }
        DbSet<CorredorVial> CorredorVial { get; }
        DbSet<Dispositivo> Dispositivo { get; }
        DbSet<Evidencia> EstadoEvidencia { get; }
        DbSet<Evidencia> Evidencia { get; }
        DbSet<PuntoGeografico> PuntoGeografico { get; }
        DbSet<PuntoSast> PuntoSast { get; }
        DbSet<TipoDispositivo> TipoDispositivo { get; }
        #endregion
    }
}

