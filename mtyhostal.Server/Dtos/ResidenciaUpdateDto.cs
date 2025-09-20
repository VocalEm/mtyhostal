using System.ComponentModel.DataAnnotations;

namespace mtyhostal.Server.Dtos
{
    public class ResidenciaUpdateDto
    {
        [Required]
        public int Id { get; set; } 

        [Required]
        [StringLength(200)]
        public string Titulo { get; set; }

        [Required]
        [StringLength(2000)]
        public string Descripcion { get; set; }

        [Required]
        [StringLength(250)]
        public string Direccion { get; set; }

        [Required]
        [Range(1, 99999.99)]
        public decimal PrecioPorNoche { get; set; }

        [Required]
        public int CiudadSedeId { get; set; }
    }
}
