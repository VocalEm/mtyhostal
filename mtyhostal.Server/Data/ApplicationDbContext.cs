using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Estas propiedades representan las tablas que se crearán en la base de datos.
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<CiudadSede> CiudadesSede { get; set; }
    public DbSet<Residencia> Residencias { get; set; }
    public DbSet<ImagenResidencia> ImagenesResidencia { get; set; }
    public DbSet<Reservacion> Reservaciones { get; set; }
    public DbSet<Pago> Pagos { get; set; }
}