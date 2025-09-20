using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mtyhostal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToResidencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Residencias",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Residencias");
        }
    }
}
