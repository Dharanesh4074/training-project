using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<UserModel> usersModel { get; set; }
        public DbSet<MasterRoleModel> masterRoleModel { get; set; }
        public DbSet<ProviderModel> providerModel { get; set; }
        public DbSet<TrainModel> trainModel { get; set; }
        public DbSet<BusModel> busModel { get; set; }
        public DbSet<FlightModel> flightModel { get; set; }
        public DbSet<BusBookingModel> busBookings { get; set; }
        public DbSet<BusPassenger> busPassengers { get; set; }
        public DbSet<TrainBookingModel> trainBookings { get; set; }
        public DbSet<TrainPassengerModel> trainPassengers { get; set; }
        public DbSet<FlightBookingModel> flightBookings { get; set; }
        public DbSet<FlightPassengerModel> flightPassengers { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BusBookingModel>()
                .Property(b => b.SeatNumbers)
                .HasConversion(
                    v => string.Join(',', v), 
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList());
        }
    }
}
