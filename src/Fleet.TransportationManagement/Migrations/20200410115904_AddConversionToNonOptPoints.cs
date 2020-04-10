using Microsoft.EntityFrameworkCore.Migrations;

namespace Fleet.TransportationManagement.Migrations
{
    public partial class AddConversionToNonOptPoints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Point");

            migrationBuilder.AddColumn<string>(
                name: "NoOptPoints",
                table: "Trips",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NoOptPoints",
                table: "Trips");

            migrationBuilder.CreateTable(
                name: "Point",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Address = table.Column<string>(nullable: true),
                    Cost = table.Column<double>(nullable: true),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Refuel = table.Column<double>(nullable: true),
                    Remainder = table.Column<double>(nullable: true),
                    TripId = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false)
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
                });

            migrationBuilder.CreateIndex(
                name: "IX_Point_TripId",
                table: "Point",
                column: "TripId");
        }
    }
}
