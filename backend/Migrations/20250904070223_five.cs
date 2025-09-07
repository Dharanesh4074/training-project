using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class five : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_providerModel_usersModel_UserId",
                table: "providerModel");

            migrationBuilder.DropIndex(
                name: "IX_providerModel_UserId",
                table: "providerModel");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "providerModel");

            migrationBuilder.AddColumn<string>(
                name: "ApprovelStatus",
                table: "providerModel",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_providerModel_usersModel_UserModelUserId",
                table: "providerModel");

            migrationBuilder.DropIndex(
                name: "IX_providerModel_UserModelUserId",
                table: "providerModel");

            migrationBuilder.DropColumn(
                name: "ApprovelStatus",
                table: "providerModel");

            migrationBuilder.DropColumn(
                name: "UserModelUserId",
                table: "providerModel");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "providerModel",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_providerModel_UserId",
                table: "providerModel",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_providerModel_usersModel_UserId",
                table: "providerModel",
                column: "UserId",
                principalTable: "usersModel",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
