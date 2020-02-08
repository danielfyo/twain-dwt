using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Dominio.Core.Agregados
{
    public interface IRepositorioBase<TEntidadGenerica> : IDisposable
    {
        IUnidadTrabajo UnidadDeTrabajo { get; }

        Task<TEntidadGenerica> Agregar(TEntidadGenerica entidad);

        Task<bool> Eliminar(int id);

        Task<bool> Actualizar(TEntidadGenerica entidad);

        Task<TEntidadGenerica> ObtenerPorId(int id);

        Task<List<TEntidadGenerica>> ListarTodo();

        Task<IEnumerable<TEntidadGenerica>> BuscarPorCoincidencias(Expression<Func<TEntidadGenerica, bool>> predicado);

        Task<TEntidadGenerica> BuscarPrimeroPorCoincidencias(Expression<Func<TEntidadGenerica, bool>> predicado);

        IEnumerable<TEntidadGenerica> GetWithRawSql(string query, params object[] parameters);
    }
}

