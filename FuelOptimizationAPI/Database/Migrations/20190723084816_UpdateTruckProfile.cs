using Microsoft.EntityFrameworkCore.Migrations;

namespace Database.Migrations
{
    public partial class UpdateTruckProfile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "FuelConsumptionPerKm",
                table: "Trucks",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "TankCapacity",
                table: "Trucks",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "WeightAdjustiveConsumptionIndex",
                table: "Trucks",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FuelConsumptionPerKm",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "TankCapacity",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "WeightAdjustiveConsumptionIndex",
                table: "Trucks");
        }
    }
}
