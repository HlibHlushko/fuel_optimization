using Microsoft.EntityFrameworkCore.Migrations;

namespace Fleet.TransportationManagement.Migrations
{
    public partial class InitDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Car = table.Column<string>(nullable: true),
                    ResidualFuel = table.Column<int>(nullable: false),
                    InputPoints = table.Column<string>(nullable: true),
                    OptimizedPoints = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trips");
        }
    }
}
