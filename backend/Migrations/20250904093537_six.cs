using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class six : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_providerModel_usersModel_UserModelUserId",
                table: "providerModel");

            migrationBuilder.DropIndex(
                name: "IX_providerModel_UserModelUserId",
                table: "providerModel");

            migrationBuilder.DropColumn(
                name: "UserModelUserId",
                table: "providerModel");

            migrationBuilder.CreateTable(
                name: "busModel",
                columns: table => new
                {
                    BusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BusType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Source = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartureTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ArrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProviderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_busModel", x => x.BusId);
                    table.ForeignKey(
                        name: "FK_busModel_providerModel_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "providerModel",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "flightModel",
                columns: table => new
                {
                    FlightId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FlightType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Source = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartureTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ArrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProviderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_flightModel", x => x.FlightId);
                    table.ForeignKey(
                        name: "FK_flightModel_providerModel_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "providerModel",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trainModel",
                columns: table => new
                {
                    TrainId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TrainType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Source = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartureTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ArrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProviderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trainModel", x => x.TrainId);
                    table.ForeignKey(
                        name: "FK_trainModel_providerModel_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "providerModel",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_busModel_ProviderId",
                table: "busModel",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_flightModel_ProviderId",
                table: "flightModel",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_trainModel_ProviderId",
                table: "trainModel",
                column: "ProviderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "busModel");

            migrationBuilder.DropTable(
                name: "flightModel");

            migrationBuilder.DropTable(
                name: "trainModel");

            migrationBuilder.AddColumn<int>(
                name: "UserModelUserId",
                table: "providerModel",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_providerModel_UserModelUserId",
                table: "providerModel",
                column: "UserModelUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_providerModel_usersModel_UserModelUserId",
                table: "providerModel",
                column: "UserModelUserId",
                principalTable: "usersModel",
                principalColumn: "UserId");
        }
    }
}
