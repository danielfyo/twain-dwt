using Datos.Persistencia.Core;
using Dominio.Core.Agregados;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Datos.Persistencia.Repositorios.Clases
{
    public class RepositorioBase<TEntidadGenerica> : IRepositorioBase<TEntidadGenerica> where TEntidadGenerica : class
    {
        private readonly IContexto _unidadTrabajo;
        public IUnidadTrabajo UnidadDeTrabajo => _unidadTrabajo;


        public RepositorioBase(IContexto unitOfWork)
        {
            _unidadTrabajo = unitOfWork;
        }

        public async Task<TEntidadGenerica> Agregar(TEntidadGenerica entity)
        {
            var response = _unidadTrabajo.Set<TEntidadGenerica>().Add(entity).Entity;
            _unidadTrabajo.Confirmar();
            return response;

        }

        public async Task<List<TEntidadGenerica>> ListarTodo()
        {
            return  await _unidadTrabajo.Set<TEntidadGenerica>().ToListAsync();
        }

        public async Task<TEntidadGenerica> ObtenerPorId(int id)
        {
            return await _unidadTrabajo.Set<TEntidadGenerica>().FindAsync(id);
        }

        public async Task<bool> Eliminar(int id)
        {
            var objBorrar = await _unidadTrabajo.Set<TEntidadGenerica>().FindAsync(id);
            _unidadTrabajo.Set<TEntidadGenerica>().Remove(objBorrar);
            _unidadTrabajo.Confirmar();
            return true;
        }

        public async Task<bool> Actualizar(TEntidadGenerica entidad)
        {
            try
            {
                _unidadTrabajo.Set<TEntidadGenerica>().Update(entidad);
                _unidadTrabajo.Confirmar();
                return true;
            }
            catch(Exception exce)
            {
                return false;
            }
        }

        public async Task<IEnumerable<TEntidadGenerica>> BuscarPorCoincidencias(Expression<Func<TEntidadGenerica, bool>> predicado)
        {
            return await _unidadTrabajo.Set<TEntidadGenerica>().Where(predicado).ToListAsync();
        }

        public async Task<TEntidadGenerica> BuscarPrimeroPorCoincidencias(Expression<Func<TEntidadGenerica, bool>> predicado)
        {
            return _unidadTrabajo.Set<TEntidadGenerica>().Where(predicado).FirstOrDefault();
        }

        #region IDisposable Support
        private bool disposedValue = false; // Para detectar llamadas redundantes

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                    _unidadTrabajo.Dispose();

                // TODO: libere los recursos no administrados (objetos no administrados) y reemplace el siguiente finalizador.
                // TODO: configure los campos grandes en nulos.

                disposedValue = true;
            }
        }

        // TODO: reemplace un finalizador solo si el anterior Dispose(bool disposing) tiene código para liberar los recursos no administrados.
        // ~BaseRepository() {
        //   // No cambie este código. Coloque el código de limpieza en el anterior Dispose(colocación de bool).
        //   Dispose(false);
        // }

        // Este código se agrega para implementar correctamente el patrón descartable.
        void IDisposable.Dispose()
        {
            // No cambie este código. Coloque el código de limpieza en el anterior Dispose(colocación de bool).
            Dispose(true);
            // TODO: quite la marca de comentario de la siguiente línea si el finalizador se ha reemplazado antes.
            // GC.SuppressFinalize(this);
        }


        public virtual IEnumerable<TEntidadGenerica> GetWithRawSql(string query, params object[] parameters)
        {
            return _unidadTrabajo.Set<TEntidadGenerica>().FromSql(query, parameters).ToList();
        }
        #endregion
    }
}
