using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using mtyhostal.Server.Interfaces; // Asumo que esta es la ruta a tus interfaces
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Configuración de Servicios ---

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IImageService, CloudinaryService>();

builder.Services.AddControllers();

// CORRECCIÓN 1: Usar AddSwaggerGen para la documentación de la API
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

// --- Configuración del Pipeline de HTTP ---

app.UseDefaultFiles();

// CORRECCIÓN 2: Usar UseStaticFiles para servir los archivos del frontend
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    // CORRECCIÓN 1 (continuación): Usar el middleware de Swagger
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();