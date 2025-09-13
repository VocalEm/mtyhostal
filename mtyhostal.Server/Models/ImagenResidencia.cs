using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ImagenResidencia
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Url { get; set; } // URL de la imagen en Cloudinary

    // Foreign Key para Residencia
    [Required]
    public int ResidenciaId { get; set; }
    [ForeignKey("ResidenciaId")]
    public Residencia Residencia { get; set; }
}