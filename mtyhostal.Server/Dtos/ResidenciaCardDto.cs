namespace mtyhostal.Server.Dtos
{
    public class ResidenciaCardDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public decimal PrecioPorNoche { get; set; }
        public string CiudadNombre { get; set; }
        public string? ImagenUrl { get; set; } 
    }
}
