namespace Digihoito.Domain.Cases;

public sealed class Message
{
    private Message() { } // EF

    internal Message(Guid patientCaseId, Guid senderId, string content)
    {
        Id = Guid.NewGuid();
        PatientCaseId = patientCaseId;
        SenderId = senderId;
        Content = content;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public Guid PatientCaseId { get; private set; }
    public Guid SenderId { get; private set; }

    public string Content { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    public DateTime? ReadAt { get; private set; }

    public void MarkAsRead()
    {
        if (ReadAt != null) return;
        ReadAt = DateTime.UtcNow;
    }
}