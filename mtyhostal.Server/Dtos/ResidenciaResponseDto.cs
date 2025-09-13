namespace mtyhostal.Server.Dtos
{
    public class ResidenciaResponseDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public decimal PrecioPorNoche { get; set; }
        public CiudadDto Ciudad { get; set; } // Usamos el DTO de Ciudad
        public AnfitrionDto Anfitrion { get; set; } // Usamos el DTO de Anfitrion
        public List<string> ImagenesUrls { get; set; }

    }
}
