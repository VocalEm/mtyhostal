using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mtyhostal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIdToImagenResidencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "ImagenesResidencia",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "ImagenesResidencia");
        }
    }
}
