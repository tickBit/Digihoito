using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Digihoito.Domain.Cases;

namespace Digihoito.Infrastructure.Persistence.Configurations;

public class PatientCaseConfiguration : IEntityTypeConfiguration<PatientCase>
{
    public void Configure(EntityTypeBuilder<PatientCase> builder)
    {
        builder.ToTable("PatientCases");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasMany(typeof(Message), "_messages")
            .WithOne()
            .HasForeignKey("PatientCaseId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation("_messages")
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}