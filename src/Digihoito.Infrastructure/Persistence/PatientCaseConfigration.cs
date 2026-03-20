namespace Digihoito.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Digihoito.Domain.Cases;


public class PatientCaseConfiguration : IEntityTypeConfiguration<PatientCase>
{
    public void Configure(EntityTypeBuilder<PatientCase> builder)
    {
    builder.ToTable("PatientCases");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.CreatedAt)
        .IsRequired();

    builder.Property(x => x.RowVersion)
        .IsRowVersion()
        .IsConcurrencyToken();
        
    builder.HasMany(x => x.Messages)
        .WithOne()
        .HasForeignKey("PatientCaseId")
        .OnDelete(DeleteBehavior.Cascade);

    builder.Metadata
        .FindNavigation(nameof(PatientCase.Messages))!
        .SetPropertyAccessMode(PropertyAccessMode.Field);

    }
}