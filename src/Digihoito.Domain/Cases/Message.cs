namespace Digihoito.Domain.Cases;

public class Message
{
    public Guid Id { get; private set; }

    public Guid PatientCaseId { get; private set; }

    public Guid SenderId { get; private set; }

    public string Content { get; private set; } = null!;

    public DateTime CreatedAt { get; private set; }

    public bool IsReadByAdmin { get; private set; }

    public bool IsReadByPatient { get; private set; }

    private Message() { } // EF Core

    internal Message(Guid patientCaseId, Guid senderId, string content)
    {
        Id = Guid.NewGuid();
        PatientCaseId = patientCaseId;
        SenderId = senderId;
        Content = content;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkAsReadByAdmin()
    {
        IsReadByAdmin = true;
    }

    public void MarkAsReadByPatient()
    {
        IsReadByPatient = true;
    }
}