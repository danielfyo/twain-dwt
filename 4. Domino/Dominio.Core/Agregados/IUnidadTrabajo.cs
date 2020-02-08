using Microsoft.EntityFrameworkCore;
using System;

namespace Dominio.Core.Agregados
{
    public interface IUnidadTrabajo : IDisposable
    {
        int Confirmar();
        void DeshacerCambios();

        DbSet<TEntidadGenerica> Set<TEntidadGenerica>() where TEntidadGenerica : class;
        void Attach<TEntidadGenerica>(TEntidadGenerica item) where TEntidadGenerica : class;
        void SetModified<TEntidadGenerica>(TEntidadGenerica item) where TEntidadGenerica : class;
    }
}

