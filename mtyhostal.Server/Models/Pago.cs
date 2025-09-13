using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Pago
{
    [Key]
    public int Id { get; set; }
    [Required]
    public decimal Monto { get; set; }
    [Required]
    public DateTime FechaPago { get; set; }
    [Required]
    public EstatusPago Estatus { get; set; }

    // Foreign Key para Reservacion
    [Required]
    public int ReservacionId { get; set; }
    [ForeignKey("ReservacionId")]
    public Reservacion Reservacion { get; set; }
}