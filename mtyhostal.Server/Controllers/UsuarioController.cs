using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using mtyhostal.Server.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IImageService _imageService; 

    // 2. Modifica el constructor para recibir IConfiguration
    public UsuarioController(ApplicationDbContext context, IConfiguration configuration, IImageService imageService)
    {
        _context = context;
        _configuration = configuration;
        _imageService = imageService;
    }

    // POST api/usuario/registro
    [HttpPost("registro")]
    public async Task<IActionResult> RegistrarUsuario(UsuarioRegisterDto usuarioDto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == usuarioDto.Email))
        {
            return BadRequest("El correo electrónico ya está en uso.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Password);

        // 3. Lee la URL por defecto desde la configuración
        var defaultProfilePicUrl = _configuration["CloudinarySettings:DefaultProfilePictureUrl"];

        var nuevoUsuario = new Usuario
        {
            Nombre = usuarioDto.Nombre,
            ApellidoPaterno = usuarioDto.ApellidoPaterno,
            ApellidoMaterno = usuarioDto.ApellidoMaterno,
            Email = usuarioDto.Email,
            PasswordHash = passwordHash,
            Rol = usuarioDto.Rol,
            FotoPerfilUrl = defaultProfilePicUrl // 4. Asigna la URL por defecto
        };

        _context.Usuarios.Add(nuevoUsuario);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuario registrado exitosamente" });
    }

    [HttpPut("{id}/foto-perfil")]
    public async Task<IActionResult> SubirFotoPerfil(int id, IFormFile file)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        var imageUrl = await _imageService.UploadImageAsync(file);
        if (imageUrl == null)
        {
            return BadRequest("No se pudo subir la imagen.");
        }

        usuario.FotoPerfilUrl = imageUrl;
        await _context.SaveChangesAsync();

        return Ok(new { url = imageUrl });
    }


    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(UsuarioLoginDto loginDto)
    {
        // 1. Buscar al usuario por su email
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (usuario == null)
        {
            return Unauthorized(new AuthResponseDto { EsExitoso = false, MensajeError = "Credenciales inválidas." });
        }

        // 2. Verificar la contraseña
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.PasswordHash))
        {
            return Unauthorized(new AuthResponseDto { EsExitoso = false, MensajeError = "Credenciales inválidas." });
        }

        // 3. Si las credenciales son válidas, generar el token JWT
        var token = GenerarJwtToken(usuario);

        return Ok(new AuthResponseDto { Token = token, EsExitoso = true });
    }

    // GET api/usuario/perfil
    [HttpGet("perfil")]
    [Authorize] 
    public async Task<IActionResult> GetPerfilUsuario()
    {
        // Gracias a [Authorize], podemos acceder a la información del usuario
        // que viene dentro del token JWT a través de User.Claims.

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var usuarioId = int.Parse(userIdClaim.Value);

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == usuarioId);

        if (usuario == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        // Es una buena práctica usar un DTO para devolver los datos del perfil
        // y no exponer el modelo de la base de datos directamente.
        var perfilDto = new
        {
            usuario.Id,
            usuario.Nombre,
            usuario.ApellidoPaterno,
            usuario.ApellidoMaterno,
            usuario.Email,
            usuario.Rol,
            usuario.FotoPerfilUrl
        };

        return Ok(perfilDto);
    }

    private string GenerarJwtToken(Usuario usuario)
    {
        // Leer la clave secreta desde la configuración
        var jwtKey = _configuration["Jwt:Key"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Los "claims" son la información que quieres guardar en el token (payload)
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Rol.ToString()), 
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Un ID único para el token
    };

        var token = new JwtSecurityToken(
            // issuer: _configuration["Jwt:Issuer"], // Opcional: Quién emite el token
            // audience: _configuration["Jwt:Audience"], // Opcional: Para quién es el token
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1), // Tiempo de expiración del token
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}