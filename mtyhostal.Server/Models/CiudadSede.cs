using System.ComponentModel.DataAnnotations;

public class CiudadSede
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Nombre { get; set; }

    public virtual ICollection<Residencia> Residencias { get; set; } = new List<Residencia>();
}