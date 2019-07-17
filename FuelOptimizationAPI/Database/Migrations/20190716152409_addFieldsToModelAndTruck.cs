using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class addFieldsToModelAndTruck : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Trucks",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Models",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Models");
        }
    }
}
