using System.ComponentModel.DataAnnotations;

public class UsuarioUpdateDto
{
    [Required]
    [StringLength(100)]
    public string Nombre { get; set; }

    [Required]
    [StringLength(100)]
    public string ApellidoPaterno { get; set; }

    [Required]
    [StringLength(100)]
    public string ApellidoMaterno { get; set; }
}