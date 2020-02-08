using Aplicacion.Contratos;
using Aplicacion.Implementacion.Servicios;
using AutoMapper;
using Datos.Persistencia.Core.Contextos;
using Datos.Persistencia.Core;
using Datos.Persistencia.Core.Seeds;
using Datos.Persistencia.Implementacion.Repositorios;
using Dominio.Contratos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Net;
using System.Text;

namespace WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var urlallowed = Configuration.GetSection("AppSettings:urlView").Value.Split("|", StringSplitOptions.RemoveEmptyEntries);
            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                //.WithOrigins(urlallowed);
                .AllowAnyOrigin();
            }));

            services.AddDbContext<Contexto>(x => x.UseSqlServer(Configuration.GetConnectionString("PruebaIoIpConnection")));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "API- Prueba IoIp", Version = "v1" });
            });
            services.AddAutoMapper();
            //services.AddTransient<Seed>();
            services.AddScoped<ICiudadServicio, CiudadServicio>();
            services.AddScoped<IDepartamentoServicio, DepartamentoServicio>();
            services.AddScoped<IPaisServicio, PaisServicio>();


            services.AddScoped<ICiudadRepositorio, CiudadRepositorio>();
            services.AddScoped<IDepartamentoRepositorio, DepartamentoRepositorio>();
            services.AddScoped<IPaisRepositorio, PaisRepositorio>(); services.AddScoped<IContexto, Contexto>();

            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                }
                );
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)//, Seed seeder)
        {

            app.UseCors("CorsPolicy");

            if (env.IsDevelopment())
            {
                //Seed.SeedEntidades(app);
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            app.UseAuthentication();
            app.UseMvc();
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API - Prueba IoIp");
            });

        }


    }
}
