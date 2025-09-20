using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mtyhostal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIdToUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FotoPerfilPublicId",
                table: "Usuarios",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FotoPerfilPublicId",
                table: "Usuarios");
        }
    }
}
