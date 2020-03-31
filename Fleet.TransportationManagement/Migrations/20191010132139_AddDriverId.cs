using Microsoft.EntityFrameworkCore.Migrations;

namespace Fleet.TransportationManagement.Migrations
{
    public partial class AddDriverId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DriverId",
                table: "Trips",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Trips");
        }
    }
}
