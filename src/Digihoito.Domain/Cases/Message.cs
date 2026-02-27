namespace Digihoito.Domain.Cases;

using Digihoito.Domain.Users;

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

        IsReadByAdmin = false;
        IsReadByPatient = false;
    }

    public void MarkAsRead(UserRole role)
    {
        if (role == UserRole.Admin)
            IsReadByAdmin = true;

        if (role == UserRole.User)
            IsReadByPatient = true;
    }

    public Guid Id { get; private set; }
    public Guid PatientCaseId { get; private set; }
    public Guid SenderId { get; private set; }

    public string Content { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    public DateTime? ReadAt { get; private set; }

    public bool IsReadByAdmin { get; private set; }
    public bool IsReadByPatient { get; private set; }

    public void MarkAsRead()
    {
        if (ReadAt != null) return;
        ReadAt = DateTime.UtcNow;
    }
}