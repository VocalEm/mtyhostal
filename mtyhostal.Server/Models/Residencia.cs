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

    [Required]
    public int CiudadSedeId { get; set; }
    [ForeignKey("CiudadSedeId")]
    public CiudadSede Ciudad { get; set; }

    [Required]
    public int AnfitrionId { get; set; }
    [ForeignKey("AnfitrionId")]
    public Usuario Anfitrion { get; set; }
    public virtual ICollection<ImagenResidencia> Imagenes { get; set; } = new List<ImagenResidencia>();

    public virtual ICollection<Reservacion> Reservaciones { get; set; } = new List<Reservacion>();

    public bool IsActive { get; set; } = true; // Por defecto, una nueva residencia está activa


}