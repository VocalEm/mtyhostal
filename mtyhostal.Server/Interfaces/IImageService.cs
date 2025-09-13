namespace mtyhostal.Server.Interfaces
{
    public interface IImageService
    {
        Task<string?> UploadImageAsync(IFormFile file);
    }
}
