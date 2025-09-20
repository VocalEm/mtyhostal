namespace mtyhostal.Server.Interfaces
{
    public class AppImageUploadResult
    {
        public string Url { get; set; }
        public string PublicId { get; set; }
    }

    public interface IImageService
    {
        Task<AppImageUploadResult?> UploadImageAsync(IFormFile file);
        Task<bool> DeleteImageAsync(string publicId);

    }
}
