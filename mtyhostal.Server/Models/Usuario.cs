using System.ComponentModel.DataAnnotations;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nombre { get; set; }

    [Required]
    [StringLength(100)]
    public string ApellidoPaterno { get; set; }

    [Required]
    [StringLength(100)]
    public string ApellidoMaterno { get; set; }

    [Required(ErrorMessage = "El email es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del email no es válido.")]
    [StringLength(150)]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public RolUsuario Rol { get; set; } 
    public string? FotoPerfilUrl { get; set; } // URL de la imagen en Cloudinary

    public string? FotoPerfilPublicId { get; set; }

    public virtual ICollection<Residencia> ResidenciasComoAnfitrion { get; set; } = new List<Residencia>();

    public virtual ICollection<Reservacion> ReservacionesComoHuesped { get; set; } = new List<Reservacion>();
}