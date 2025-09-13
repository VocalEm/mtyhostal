using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Reservacion
{
    [Key]
    public int Id { get; set; }
    [Required]
    public DateTime FechaInicio { get; set; }
    [Required]
    public DateTime FechaFin { get; set; }
    [Required]
    public EstatusReservacion Estatus { get; set; } // "pendiente", "pagada", "cancelada"

    [Required]
    public decimal PrecioTotal { get; set; }

    // Foreign Key para Residencia
    [Required]
    public int ResidenciaId { get; set; }
    [ForeignKey("ResidenciaId")]
    public Residencia Residencia { get; set; }

    // Foreign Key para el Huésped (Usuario)
    [Required]
    public int HuespedId { get; set; }
    [ForeignKey("HuespedId")]
    public Usuario Huesped { get; set; }
}