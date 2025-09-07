using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class eleven : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "JournyStartTime",
                table: "trainBookings",
                newName: "JourneyStartTime");

            migrationBuilder.RenameColumn(
                name: "JournyStartTime",
                table: "flightBookings",
                newName: "JourneyStartTime");

            migrationBuilder.RenameColumn(
                name: "JournyStartTime",
                table: "busBookings",
                newName: "JourneyStartTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "JourneyStartTime",
                table: "trainBookings",
                newName: "JournyStartTime");

            migrationBuilder.RenameColumn(
                name: "JourneyStartTime",
                table: "flightBookings",
                newName: "JournyStartTime");

            migrationBuilder.RenameColumn(
                name: "JourneyStartTime",
                table: "busBookings",
                newName: "JournyStartTime");
        }
    }
}
