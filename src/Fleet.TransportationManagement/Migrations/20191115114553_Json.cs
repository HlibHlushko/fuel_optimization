using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Fleet.TransportationManagement.Migrations
{
    public partial class Json : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Point");

            migrationBuilder.AddColumn<string>(
                name: "InputPoints",
                table: "Trips",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OptimizedPoints",
                table: "Trips",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InputPoints",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "OptimizedPoints",
                table: "Trips");

            migrationBuilder.CreateTable(
                name: "Point",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Label = table.Column<string>(nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    Load = table.Column<int>(nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(10,7)", nullable: false),
                    Refuel = table.Column<int>(nullable: true),
                    TripId = table.Column<int>(nullable: true),
                    TripId1 = table.Column<int>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Unload = table.Column<int>(nullable: true)
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
    }
}
