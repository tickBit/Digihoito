namespace Digihoito.Domain.Cases;

using Digihoito.Domain.Users;

public sealed class PatientCase
{
    private readonly List<Message> _messages = new();
    public IReadOnlyCollection<Message> Messages => _messages;

    private PatientCase() { } // EF

    private PatientCase(Guid patientId, string subject, string initialMessage)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        CreatedAt = DateTime.UtcNow;
        Subject = subject;

        var message = new Message(Id, patientId, UserRole.User, initialMessage);
        _messages.Add(message);
    }

    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LockedAt { get; private set; }
    public Guid? ClosedByAdminId { get; private set; }
    public byte[] RowVersion { get; private set; } = default!;
    public string? Subject { get; private set; }
    public bool IsLocked => LockedAt != null;

    public static PatientCase Create(Guid patientId, string subject, string initialMessage)
        => new(patientId, subject, initialMessage);

    public void AddMessage(Guid senderId, string content, UserRole role)
    {
        if (IsLocked)
            throw new InvalidOperationException("Case is locked");

        if (role == UserRole.User && senderId != PatientId)
            throw new InvalidOperationException("Not case owner");

        var message = new Message(Id, senderId, role, content);
        _messages.Add(message);
        
    }

    public void Lock(Guid adminId)
    {
        if (IsLocked)
            throw new InvalidOperationException("Case already locked");

        LockedAt = DateTime.UtcNow;
        ClosedByAdminId = adminId;
    }
}