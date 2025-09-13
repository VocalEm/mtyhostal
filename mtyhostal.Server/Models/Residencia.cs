using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Residencia
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Titulo { get; set; }
    [Required]
    public string Descripcion { get; set; }
    [Required]
    public string Direccion { get; set; }
    [Required]
    public decimal PrecioPorNoche { get; set; }

    // Foreign Key para CiudadSede
    [Required]
    public int CiudadSedeId { get; set; }
    [ForeignKey("CiudadSedeId")]
    public CiudadSede Ciudad { get; set; }

    // Foreign Key para el Anfitrión (Usuario)
    [Required]
    public int AnfitrionId { get; set; }
    [ForeignKey("AnfitrionId")]
    public Usuario Anfitrion { get; set; }
    // Una residencia puede tener muchas imágenes.
    public virtual ICollection<ImagenResidencia> Imagenes { get; set; } = new List<ImagenResidencia>();

    // Una residencia puede tener muchas reservaciones.
    public virtual ICollection<Reservacion> Reservaciones { get; set; } = new List<Reservacion>();

}