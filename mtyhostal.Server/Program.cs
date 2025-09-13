using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using mtyhostal.Server.Interfaces; // Asumo que esta es la ruta a tus interfaces
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Configuraci�n de Servicios ---

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IImageService, CloudinaryService>();

builder.Services.AddControllers();

// CORRECCI�N 1: Usar AddSwaggerGen para la documentaci�n de la API
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// --- Configuraci�n del Pipeline de HTTP ---

app.UseDefaultFiles();

// CORRECCI�N 2: Usar UseStaticFiles para servir los archivos del frontend
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    // CORRECCI�N 1 (continuaci�n): Usar el middleware de Swagger
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();