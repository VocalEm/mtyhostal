using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mtyhostal.Server.Dtos;
using mtyhostal.Server.Interfaces;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize] // 1. Protege todo el controlador por defecto
public class ResidenciasController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IImageService _imageService; // 1. Añade el servicio de imagen

    public ResidenciasController(ApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService; // <-- Esta línea es crucial

    }

    // POST: api/residencias
    [HttpPost]
    [Authorize(Roles = "Anfitrion")] 
    public async Task<IActionResult> CrearResidencia(ResidenciaCreateDto residenciaDto)
    {
        //  Obtenemos el ID del anfitrión desde el token JWT
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

        //  Creamos la nueva entidad Residencia
        var nuevaResidencia = new Residencia
        {
            Titulo = residenciaDto.Titulo,
            Descripcion = residenciaDto.Descripcion,
            Direccion = residenciaDto.Direccion,
            PrecioPorNoche = residenciaDto.PrecioPorNoche,
            CiudadSedeId = residenciaDto.CiudadSedeId,
            AnfitrionId = anfitrionId // Asociamos la residencia con el anfitrión logueado
        };

        //  Guardamos en la base de datos
        _context.Residencias.Add(nuevaResidencia);
        await _context.SaveChangesAsync();


        var residenciaCompleta = await _context.Residencias
            .Include(r => r.Ciudad)
            .Include(r => r.Anfitrion)
            .FirstOrDefaultAsync(r => r.Id == nuevaResidencia.Id);

        // Mapeamos la entidad al DTO de respuesta
        var respuestaDto = new ResidenciaResponseDto
        {
            Id = residenciaCompleta.Id,
            Titulo = residenciaCompleta.Titulo,
            Descripcion = residenciaCompleta.Descripcion,
            PrecioPorNoche = residenciaCompleta.PrecioPorNoche,
            Ciudad = new CiudadDto
            {
                Id = residenciaCompleta.Ciudad.Id,
                Nombre = residenciaCompleta.Ciudad.Nombre
            },
            Anfitrion = new AnfitrionDto
            {
                Id = residenciaCompleta.Anfitrion.Id,
                Nombre = residenciaCompleta.Anfitrion.Nombre,
                FotoPerfilUrl = residenciaCompleta.Anfitrion.FotoPerfilUrl
            }
        };

        return Ok(respuestaDto);
    }

    // POST: api/residencias/2/imagenes
    [HttpPost("{residenciaId}/imagenes")]
    [Authorize(Roles = "Anfitrion")]
    public async Task<IActionResult> SubirImagenesResidencia(int residenciaId, [FromForm] List<IFormFile> files)
    {
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);
        var residencia = await _context.Residencias.FindAsync(residenciaId);

        if (residencia == null || residencia.AnfitrionId != anfitrionId)
        {
            
            return StatusCode(403, "No tienes permiso para añadir imágenes a esta residencia.");
        }

        if (files == null || files.Count == 0)
        {
            return BadRequest("No se han seleccionado archivos.");
        }

        var urlsImagenes = new List<string>();

        foreach (var archivo in files)
        {
            var imageUrl = await _imageService.UploadImageAsync(archivo);
            if (imageUrl != null)
            {
                var nuevaImagen = new ImagenResidencia
                {
                    Url = imageUrl,
                    ResidenciaId = residenciaId
                };
                _context.ImagenesResidencia.Add(nuevaImagen);
                urlsImagenes.Add(imageUrl);
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Imágenes subidas exitosamente.", urls = urlsImagenes });
    }

    // GET: api/residencias/1
    [HttpGet("{id}")]
    [AllowAnonymous] 
    public async Task<IActionResult> GetResidenciaPorId(int id)
    {
        //  Buscamos la residencia e incluimos sus datos relacionados
        var residencia = await _context.Residencias
            .Include(r => r.Ciudad)      
            .Include(r => r.Anfitrion)   
            .Include(r => r.Imagenes)   
            .FirstOrDefaultAsync(r => r.Id == id);

        //  Si no se encuentra, devolvemos un error 404
        if (residencia == null)
        {
            return NotFound("Residencia no encontrada.");
        }

        //  Mapeamos la entidad al DTO para dar forma a la respuesta
        var respuestaDto = new ResidenciaResponseDto
        {
            Id = residencia.Id,
            Titulo = residencia.Titulo,
            Descripcion = residencia.Descripcion,
            PrecioPorNoche = residencia.PrecioPorNoche,
            Ciudad = new CiudadDto
            {
                Id = residencia.Ciudad.Id,
                Nombre = residencia.Ciudad.Nombre
            },
            Anfitrion = new AnfitrionDto
            {
                Id = residencia.Anfitrion.Id,
                Nombre = $"{residencia.Anfitrion.Nombre} {residencia.Anfitrion.ApellidoPaterno}",
                FotoPerfilUrl = residencia.Anfitrion.FotoPerfilUrl
            },
            // Mapeamos solo las URLs de las imágenes
            ImagenesUrls = residencia.Imagenes.Select(img => img.Url).ToList()
        };

        return Ok(respuestaDto);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllResidencias()
    {
        var residencias = await _context.Residencias
            .Include(r => r.Ciudad)
            .Include(r => r.Imagenes) 
            .Select(r => new ResidenciaCardDto 
            {
                Id = r.Id,
                Titulo = r.Titulo,
                PrecioPorNoche = r.PrecioPorNoche,
                CiudadNombre = r.Ciudad.Nombre,
                ImagenUrl = r.Imagenes.Select(img => img.Url).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(residencias);
    }
}