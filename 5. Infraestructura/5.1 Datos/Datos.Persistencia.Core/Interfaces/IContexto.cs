using Dominio.Core.Agregados;
using Dominio.Core.Entidades;
using Microsoft.EntityFrameworkCore;
using System;


namespace Datos.Persistencia.Core
{
    public interface IContexto : IUnidadTrabajo, IDisposable
    {
        DbSet<Ciudad> Ciudad { get; }
        DbSet<Departamento> Departamento { get; }
        DbSet<Pais> Pais { get; }
    }
}

