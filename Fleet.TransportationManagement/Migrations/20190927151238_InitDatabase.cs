using Microsoft.EntityFrameworkCore.Metadata;
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
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TruckId = table.Column<int>(nullable: false),
                    ResidualFuel = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Point",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Latitude = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    Label = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Load = table.Column<int>(nullable: true),
                    Unload = table.Column<int>(nullable: true),
                    Refuel = table.Column<int>(nullable: true),
                    TripId = table.Column<int>(nullable: true),
                    TripId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Point", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Point_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Point_Trips_TripId1",
                        column: x => x.TripId1,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Point_TripId",
                table: "Point",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_Point_TripId1",
                table: "Point",
                column: "TripId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Point");

            migrationBuilder.DropTable(
                name: "Trips");
        }
    }
}
