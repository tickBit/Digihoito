namespace Digihoito.Domain.Cases;

using Digihoito.Domain.Users;

public sealed class Message
{
    private Message() { } // EF

    internal Message(
        Guid patientCaseId,
        Guid senderId,
        UserRole senderRole,
        string content)
    {
        Id = Guid.NewGuid();
        PatientCaseId = patientCaseId;
        SenderId = senderId;
        SenderRole = senderRole;
        Content = content;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }

    public Guid PatientCaseId { get; private set; }

    public Guid SenderId { get; private set; }

    public UserRole SenderRole { get; private set; }

    public string Content { get; private set; } = default!;

    public DateTime CreatedAt { get; private set; }

    public bool IsReadByAdmin { get; private set; }

    public bool IsReadByPatient { get; private set; }

    public void MarkAsRead(UserRole role)
    {
        if (role == UserRole.User)
        {
            IsReadByPatient = true;
        }
    
        if (role == UserRole.Admin)
        {
            IsReadByAdmin = true;
        }
    }
}