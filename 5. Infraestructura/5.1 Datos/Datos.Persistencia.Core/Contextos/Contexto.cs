using Dominio.Core.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Datos.Persistencia.Core.Contextos
{
    public class Contexto : DbContext, IContexto
    {
        private IConfiguration _config;
        private string _connectionString;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }

        public Contexto(DbContextOptions<Contexto> options, IConfiguration config) : base()//options)
        {
            _config = config;
            DefinirCadenaConexion();
        }

        public void DefinirCadenaConexion()
        {
            _connectionString = _config.GetConnectionString("PruebaIoIpConnection");
        }

        public virtual DbSet<Ciudad> Ciudad { get; set; }
        public virtual DbSet<Departamento> Departamento { get; set; }
        public virtual DbSet<Pais> Pais { get; set; }

        public new DbSet<TGenericEntity> Set<TGenericEntity>() where TGenericEntity : class

        {
            return base.Set<TGenericEntity>();
        }

        public void Attach<TGenericEntity>(TGenericEntity item) where TGenericEntity : class
        {
            if (Entry(item).State == EntityState.Detached)
                base.Set<TGenericEntity>().Attach(item);
        }

        public void SetModified<TGenericEntity>(TGenericEntity item) where TGenericEntity : class
        {
            Entry(item).State = EntityState.Modified;
        }

        public int Confirmar()
        {
            return base.SaveChanges();
        }

        public void DeshacerCambios()
        {
            base.ChangeTracker.Entries()
            .Where(e => e.Entity != null).ToList()
            .ForEach(e => e.State = EntityState.Detached);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //IConfiguration.LazyLoadingEnabled = false;//false;
            //Configuration.ProxyCreationEnabled = false;

            //modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            //modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            base.OnModelCreating(modelBuilder);
        }
    }
}