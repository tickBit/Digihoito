namespace Digihoito.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Digihoito.Domain.Cases;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("Messages");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Content)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasIndex(x => x.PatientCaseId);
    }
}