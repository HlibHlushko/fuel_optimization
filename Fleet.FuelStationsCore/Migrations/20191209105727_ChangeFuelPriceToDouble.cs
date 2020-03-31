using Microsoft.EntityFrameworkCore.Migrations;

namespace Fleet.FuelStationsCore.Migrations
{
    public partial class ChangeFuelPriceToDouble : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Price",
                table: "FuelPrices",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Price",
                table: "FuelPrices",
                nullable: false,
                oldClrType: typeof(double));
        }
    }
}
