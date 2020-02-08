using Datos.Persistencia.Core.Contextos;
using Dominio.Core.Entidades;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Datos.Persistencia.Core.Seeds
{
    public static class Seed
    {
        public static void SeedEntidades(Contexto contexto)
        {

            SeedPais(contexto);
            SeedDepartamento(contexto);
            SeedCiudad(contexto);
        }

        private static void SeedPais(Contexto contexto)
        {
            try
            {
                contexto.Database.OpenConnection();
                try
                {
                    contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Pais ON");
                }
                catch { }

                var entityData = File.ReadAllText("Seeds/PaisSeedData.json");
                var persons = JsonConvert.DeserializeObject<List<Pais>>(entityData);
                foreach (var item in persons)
                {
                    var item2 = contexto.Pais.Find(item.PaisId);

                    if (item2 != null)
                        contexto.Pais.Update(item2);
                    else
                        contexto.Pais.Add(item);
                }
                contexto.Confirmar();

            }
            catch (Exception exce)
            {
                contexto.DeshacerCambios();
            }
            finally
            {
                contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Pais OFF");
                contexto.SaveChanges();
                contexto.Database.CloseConnection();
            }
        }

        private static void SeedDepartamento(Contexto contexto)
        {
            try
            {
                try
                {
                    contexto.Database.OpenConnection();

                    contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Departamento ON");

                }
                catch { }

                var entityData = File.ReadAllText("Seeds/DepartamentoSeedData.json");
                var persons = JsonConvert.DeserializeObject<List<Departamento>>(entityData);
                foreach (var item in persons)
                {
                    var item2 = contexto.Departamento.Find(item.DepartamentoId);

                    if (item2 != null)
                        contexto.Departamento.Update(item2);
                    else
                        contexto.Departamento.Add(item);
                }
                contexto.Confirmar();

                contexto.Database.OpenConnection();
                try
                {
                    contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Departamento OFF");
                    contexto.SaveChanges();
                }
                finally
                {
                    contexto.Database.CloseConnection();
                }
            }
            catch (Exception exce)
            {
                contexto.DeshacerCambios();
            }
        }

        private static void SeedCiudad(Contexto contexto)
        {
            try
            {
                try
                {
                    contexto.Database.OpenConnection();

                    contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Ciudad ON");

                }
                catch(Exception exce) 
                {
                    contexto.Database.CloseConnection();

                }

                var entityData = File.ReadAllText("Seeds/CiudadSeedData.json");
                var persons = JsonConvert.DeserializeObject<List<Ciudad>>(entityData);
                foreach (var item in persons)
                {
                    var item2 = contexto.Ciudad.Find(item.CiudadId);

                    if (item2 != null)
                        contexto.Ciudad.Update(item2);
                    else
                        contexto.Ciudad.Add(item);
                }
                contexto.Confirmar();
                contexto.Database.OpenConnection();
                try
                {
                    contexto.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Ciudad OFF");
                    contexto.SaveChanges();
                }
                finally
                {
                    contexto.Database.CloseConnection();
                }
            }
            catch (Exception exce)
            {
                contexto.DeshacerCambios();
            }
        }

    }
}
