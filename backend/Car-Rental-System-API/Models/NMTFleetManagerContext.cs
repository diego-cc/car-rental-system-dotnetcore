using System;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Car_Rental_System_API
{
    public partial class NMTFleetManagerContext : DbContext
    {
        public NMTFleetManagerContext(DbContextOptions<NMTFleetManagerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Booking> Bookings { get; set; }
        public virtual DbSet<FuelPurchase> FuelPurchases { get; set; }
        public virtual DbSet<Journey> Journeys { get; set; }
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<Vehicle> Vehicles { get; set; }

        /**
         * Comment out OnModelCreating() and OnModelCreatingPartial() before running tests
         * Otherwise they will fail, because of syntax differences between MySQL and SQLite
         * 
         */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("bookings");

                entity.HasIndex(e => new { e.Id, e.Uuid })
                    .HasName("id");

                entity.HasIndex(e => new { e.VehicleId, e.VehicleUuid })
                    .HasName("vehicle_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.Cost)
                    .HasColumnName("cost")
                    .HasColumnType("unsigned decimal(10,2)")
                    .HasDefaultValueSql("'0.00'");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.EndedAt)
                    .HasColumnName("ended_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.StartOdometer)
                    .HasColumnName("start_odometer")
                    .HasColumnType("unsigned decimal(10,2)");

                entity.Property(e => e.StartedAt)
                    .HasColumnName("started_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("enum('D','K')")
                    .HasDefaultValueSql("'D'")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.VehicleId)
                    .HasColumnName("vehicle_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.VehicleUuid)
                    .HasColumnName("vehicle_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<FuelPurchase>(entity =>
            {
                entity.ToTable("fuel_purchases");

                entity.HasIndex(e => new { e.BookingId, e.BookingUuid })
                    .HasName("booking_id");

                entity.HasIndex(e => new { e.Id, e.Uuid })
                    .HasName("id");

                entity.HasIndex(e => new { e.VehicleId, e.VehicleUuid })
                    .HasName("vehicle_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.BookingId)
                    .HasColumnName("booking_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.BookingUuid)
                    .HasColumnName("booking_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.FuelPrice)
                    .HasColumnName("fuel_price")
                    .HasColumnType("unsigned decimal(5,2)");

                entity.Property(e => e.FuelQuantity)
                    .HasColumnName("fuel_quantity")
                    .HasColumnType("unsigned decimal(5,2)");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.VehicleId)
                    .HasColumnName("vehicle_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.VehicleUuid)
                    .HasColumnName("vehicle_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<Journey>(entity =>
            {
                entity.ToTable("journeys");

                entity.HasIndex(e => new { e.BookingId, e.BookingUuid })
                    .HasName("booking_id");

                entity.HasIndex(e => new { e.Id, e.Uuid })
                    .HasName("id");

                entity.HasIndex(e => new { e.VehicleId, e.VehicleUuid })
                    .HasName("vehicle_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.BookingId)
                    .HasColumnName("booking_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.BookingUuid)
                    .HasColumnName("booking_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.EndOdometer)
                    .HasColumnName("end_odometer")
                    .HasColumnType("unsigned decimal(10,2)");

                entity.Property(e => e.EndedAt)
                    .HasColumnName("ended_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.JourneyFrom)
                    .HasColumnName("journey_from")
                    .HasColumnType("varchar(128)")
                    .HasDefaultValueSql("'Unknown'")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.JourneyTo)
                    .HasColumnName("journey_to")
                    .HasColumnType("varchar(128)")
                    .HasDefaultValueSql("'Unknown'")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.StartOdometer)
                    .HasColumnName("start_odometer")
                    .HasColumnType("unsigned decimal(10,2)");

                entity.Property(e => e.StartedAt)
                    .HasColumnName("started_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.VehicleId)
                    .HasColumnName("vehicle_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.VehicleUuid)
                    .HasColumnName("vehicle_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.ToTable("services");

                entity.HasIndex(e => new { e.Id, e.Uuid })
                    .HasName("id");

                entity.HasIndex(e => new { e.VehicleId, e.VehicleUuid })
                    .HasName("vehicle_id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Odometer)
                    .HasColumnName("odometer")
                    .HasColumnType("unsigned decimal(10,2)");

                entity.Property(e => e.ServicedAt)
                    .HasColumnName("serviced_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.VehicleId)
                    .HasColumnName("vehicle_id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.VehicleUuid)
                    .HasColumnName("vehicle_uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.ToTable("vehicles");

                entity.HasIndex(e => new { e.Id, e.Uuid })
                    .HasName("id");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("unsigned bigint(20)");

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.FuelType)
                    .IsRequired()
                    .HasColumnName("fuel_type")
                    .HasColumnType("varchar(8)")
                    .HasDefaultValueSql("'Unknown'")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Manufacturer)
                    .IsRequired()
                    .HasColumnName("manufacturer")
                    .HasColumnType("varchar(64)")
                    .HasDefaultValueSql("'Unknown'")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Model)
                    .IsRequired()
                    .HasColumnName("model")
                    .HasColumnType("varchar(128)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Odometer)
                    .HasColumnName("odometer")
                    .HasColumnType("unsigned decimal(10,2)");

                entity.Property(e => e.Registration)
                    .IsRequired()
                    .HasColumnName("registration")
                    .HasColumnType("varchar(16)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.TankSize)
                    .HasColumnName("tank_size")
                    .HasColumnType("unsigned decimal(5,2)");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnName("updated_at")
                    .HasColumnType("datetime")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Year)
                    .HasColumnName("year")
                    .HasColumnType("unsigned int(4) zerofill")
                    .HasDefaultValueSql("'0001'");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}