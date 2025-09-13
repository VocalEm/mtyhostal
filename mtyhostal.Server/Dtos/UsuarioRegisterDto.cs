using System.ComponentModel.DataAnnotations;

public class UsuarioRegisterDto
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

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
    // --- AÑADE ESTA LÍNEA ---
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
       ErrorMessage = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un caracter especial.")]
    public string Password { get; set; }

    [Required]
    public RolUsuario Rol { get; set; } // Usamos el Enum que creamos
} 