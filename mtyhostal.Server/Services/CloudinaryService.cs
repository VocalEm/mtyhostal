using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using mtyhostal.Server.Interfaces; // Asegúrate de que el namespace sea correcto


public class CloudinaryService : IImageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]);
        _cloudinary = new Cloudinary(account);
    }

    // --- CAMBIO 1: El tipo de retorno ahora es ImageUploadResult ---
    public async Task<AppImageUploadResult?> UploadImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }

        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            // Si hay un error en la subida, devolvemos null
            return null;
        }

        // --- CAMBIO 2: Devolvemos el objeto completo, no solo la URL ---
        return new AppImageUploadResult
        {
            Url = uploadResult.SecureUrl?.ToString(),
            PublicId = uploadResult.PublicId
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);

        // El resultado es "ok" si la eliminación fue exitosa.
        return result.Result == "ok";
    }
}