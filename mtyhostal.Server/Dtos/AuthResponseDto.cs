public class AuthResponseDto
{
    public string Token { get; set; }
    public bool EsExitoso { get; set; }
    public string? MensajeError { get; set; }
}