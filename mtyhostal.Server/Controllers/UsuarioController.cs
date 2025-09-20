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

        // Lee la URL por defecto desde la configuración
        var defaultProfilePicUrl = _configuration["CloudinarySettings:DefaultProfilePictureUrl"];

        var nuevoUsuario = new Usuario
        {
            Nombre = usuarioDto.Nombre,
            ApellidoPaterno = usuarioDto.ApellidoPaterno,
            ApellidoMaterno = usuarioDto.ApellidoMaterno,
            Email = usuarioDto.Email,
            PasswordHash = passwordHash,
            Rol = usuarioDto.Rol,
            FotoPerfilUrl = defaultProfilePicUrl // Asigna la URL por defecto
        };

        _context.Usuarios.Add(nuevoUsuario);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuario registrado exitosamente" });
    }

    // En UsuarioController.cs

    [HttpPut("{id}/foto-perfil")] // necesitas cambiarlo para que lo haga pidiendo authorization
    public async Task<IActionResult> SubirFotoPerfil(int id, IFormFile file)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        // 1. Si el usuario ya tiene una foto, la borramos de Cloudinary primero
        if (!string.IsNullOrEmpty(usuario.FotoPerfilPublicId))
        {
            await _imageService.DeleteImageAsync(usuario.FotoPerfilPublicId);
        }

        // 2. Subimos la nueva imagen
        var uploadResult = await _imageService.UploadImageAsync(file);
        if (uploadResult == null)
        {
            return BadRequest("No se pudo subir la imagen.");
        }

        // 3. Guardamos los nuevos datos de la imagen en la BD
        usuario.FotoPerfilUrl = uploadResult.Url;
        usuario.FotoPerfilPublicId = uploadResult.PublicId;
        await _context.SaveChangesAsync();

        return Ok(new { url = uploadResult.Url });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(UsuarioLoginDto loginDto)
    {
        // Buscar al usuario por su email
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (usuario == null)
        {
            return Unauthorized(new AuthResponseDto { EsExitoso = false, MensajeError = "Credenciales inválidas." });
        }

        // Verificar la contraseña
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.PasswordHash))
        {
            return Unauthorized(new AuthResponseDto { EsExitoso = false, MensajeError = "Credenciales inválidas." });
        }

        // Si las credenciales son válidas, generar el token JWT
        var token = GenerarJwtToken(usuario);

        return Ok(new AuthResponseDto { Token = token, EsExitoso = true });
    }

    // GET api/usuario/perfil
    [HttpGet("perfil")]
    [Authorize] 
    public async Task<IActionResult> GetPerfilUsuario()
    {
      

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

        // Los claims son la información que quieres guardar en el token (payload)
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Rol.ToString()), 
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Un ID único para el token
    };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPut("perfil")]
    [Authorize] 
    public async Task<IActionResult> UpdatePerfil(UsuarioUpdateDto updateDto)
    {
        var usuarioId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

        var usuario = await _context.Usuarios.FindAsync(usuarioId);

        if (usuario == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        usuario.Nombre = updateDto.Nombre;
        usuario.ApellidoPaterno = updateDto.ApellidoPaterno;
        usuario.ApellidoMaterno = updateDto.ApellidoMaterno;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Perfil actualizado exitosamente." });
    }
}