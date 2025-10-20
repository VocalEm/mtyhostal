using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mtyhostal.Server.Dtos;
using mtyhostal.Server.Interfaces;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ResidenciasController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IImageService _imageService; 

    public ResidenciasController(ApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService; 

    }

    // api/residencias
    [HttpPost]
    [Authorize(Roles = "Anfitrion")] 
    public async Task<IActionResult> CrearResidencia(ResidenciaCreateDto residenciaDto)
    {
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

        var nuevaResidencia = new Residencia
        {
            Titulo = residenciaDto.Titulo,
            Descripcion = residenciaDto.Descripcion,
            Direccion = residenciaDto.Direccion,
            PrecioPorNoche = residenciaDto.PrecioPorNoche,
            CiudadSedeId = residenciaDto.CiudadSedeId,
            AnfitrionId = anfitrionId 
        };

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

    // api/residencias/2/imagenes
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
            var uploadResult = await _imageService.UploadImageAsync(archivo); // Ahora devuelve un objeto
            if (uploadResult != null)
            {
                var nuevaImagen = new ImagenResidencia
                {
                    Url = uploadResult.Url,
                    PublicId = uploadResult.PublicId, 
                    ResidenciaId = residenciaId
                };
                _context.ImagenesResidencia.Add(nuevaImagen);
                urlsImagenes.Add(uploadResult.Url);
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Imágenes subidas exitosamente.", urls = urlsImagenes });
    }

    [HttpDelete("{residenciaId}/imagenes/{imagenId}")]
    [Authorize(Roles = "Anfitrion")]
    public async Task<IActionResult> DeleteImagenResidencia(int residenciaId, int imagenId)
    {
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);
        var residencia = await _context.Residencias.FindAsync(residenciaId);

        if (residencia == null || residencia.AnfitrionId != anfitrionId)
        {
            return StatusCode(403, "No tienes permiso para modificar esta residencia.");
        }

        var imagen = await _context.ImagenesResidencia.FindAsync(imagenId);
        if (imagen == null)
        {
            return NotFound("Imagen no encontrada.");
        }

        if (imagen.ResidenciaId != residenciaId)
        {
            return BadRequest("La imagen no pertenece a la residencia especificada.");
        }

        var deleteSuccess = await _imageService.DeleteImageAsync(imagen.PublicId);
        if (!deleteSuccess)
        {
            return StatusCode(500, "Error al eliminar la imagen del proveedor externo.");
        }

        _context.ImagenesResidencia.Remove(imagen);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content es la respuesta estándar para un DELETE exitoso
    } 


    [HttpPut("{residenciaId}/imagenes")]
    [Authorize(Roles = "Anfitrion")]
    public async Task<IActionResult> UpdateImagenesResidencia(int residenciaId, [FromForm] List<IFormFile> nuevosArchivos)
    {
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);
        var residencia = await _context.Residencias
            .Include(r => r.Imagenes) 
            .FirstOrDefaultAsync(r => r.Id == residenciaId);

        if (residencia == null || residencia.AnfitrionId != anfitrionId)
        {
            return StatusCode(403, "No tienes permiso para modificar esta residencia.");
        }

        foreach (var imagenExistente in residencia.Imagenes)
        {
            await _imageService.DeleteImageAsync(imagenExistente.PublicId);
            _context.ImagenesResidencia.Remove(imagenExistente);
        }

        if (nuevosArchivos == null || nuevosArchivos.Count == 0)
        {
            return BadRequest("Debes seleccionar al menos un nuevo archivo.");
        }

        var urlsNuevasImagenes = new List<string>();

        foreach (var archivo in nuevosArchivos)
        {
            var uploadResult = await _imageService.UploadImageAsync(archivo);
            if (uploadResult != null)
            {
                var nuevaImagen = new ImagenResidencia
                {
                    Url = uploadResult.Url,
                    PublicId = uploadResult.PublicId,
                    ResidenciaId = residenciaId
                };
                _context.ImagenesResidencia.Add(nuevaImagen);
                urlsNuevasImagenes.Add(uploadResult.Url);
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Imágenes actualizadas exitosamente.", urls = urlsNuevasImagenes });
    }

    // api/residencias/1
    [HttpGet("{id}")]
    [AllowAnonymous] 
    public async Task<IActionResult> GetResidenciaPorId(int id)
    {
        var residencia = await _context.Residencias
            .Include(r => r.Ciudad)      
            .Include(r => r.Anfitrion)   
            .Include(r => r.Imagenes)
            .Where(r => r.IsActive)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (residencia == null)
        {
            return NotFound("Residencia no encontrada.");
        }

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
            .Where(r => r.IsActive)
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

    [HttpPut("{id}")]
    [Authorize(Roles = "Anfitrion")]
    public async Task<IActionResult> UpdateResidencia(int id, ResidenciaUpdateDto updateDto)
    {
        // Verificamos que el ID de la ruta coincida con el ID del cuerpo
        if (id != updateDto.Id)
        {
            return BadRequest("El ID de la ruta no coincide con el ID del cuerpo de la petición.");
        }

        //  Obtenemos el ID del anfitrión desde el token JWT
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

        // Buscamos la residencia en la base de datos
        var residencia = await _context.Residencias.FindAsync(id);

        if (residencia == null)
        {
            return NotFound("La residencia no fue encontrada.");
        }

        if (residencia.AnfitrionId != anfitrionId)
        {
            return StatusCode(403, "No tienes permiso para modificar esta residencia.");
        }

        residencia.Titulo = updateDto.Titulo;
        residencia.Descripcion = updateDto.Descripcion;
        residencia.Direccion = updateDto.Direccion;
        residencia.PrecioPorNoche = updateDto.PrecioPorNoche;
        residencia.CiudadSedeId = updateDto.CiudadSedeId;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Residencia actualizada exitosamente." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Anfitrion")]
    public async Task<IActionResult> DeleteResidencia(int id)
    {
        var anfitrionId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

        var residencia = await _context.Residencias.FindAsync(id);

        if (residencia == null)
        {
            return NotFound("La residencia no fue encontrada.");
        }

        if (residencia.AnfitrionId != anfitrionId)
        {
            return StatusCode(403, "No tienes permiso para borrar esta residencia.");
        }

        residencia.IsActive = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}