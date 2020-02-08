using System.Threading.Tasks;

namespace Datos.Persistencia.Core.Interfaces
{
    public interface ISeed
    {
        Task SeedPais();
        Task SeedDepartamento();
        Task SeedCiudad();
    }
}
