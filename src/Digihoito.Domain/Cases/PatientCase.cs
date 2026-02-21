namespace Digihoito.Domain.Cases;

using Digihoito.Domain.Users;

public sealed class PatientCase
{
    private readonly List<Message> _messages = new();

    private PatientCase() { } // EF

    private PatientCase(Guid patientId, string initialMessage)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        CreatedAt = DateTime.UtcNow;

        var message = new Message(Id, patientId, initialMessage);
        _messages.Add(message);
    }

    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime? LockedAt { get; private set; }
    public Guid? ClosedByAdminId { get; private set; }

    public byte[] RowVersion { get; private set; } = default!;

    public IReadOnlyCollection<Message> Messages => _messages.AsReadOnly();

    public static PatientCase Create(Guid patientId, string initialMessage)
    {
        return new PatientCase(patientId, initialMessage);
    }
    

    public void AddMessage(Guid senderId, string content, UserRole role)
    {
        if (LockedAt != null)
            throw new InvalidOperationException("Case is locked");

        if (role == UserRole.User && senderId != PatientId)
            throw new InvalidOperationException("Not case owner");

        var message = new Message(Id, senderId, content);
        _messages.Add(message);
    }

    public void Lock(Guid adminId)
    {
        if (LockedAt != null)
            throw new InvalidOperationException("Case already locked.");

        LockedAt = DateTime.UtcNow;
        ClosedByAdminId = adminId;
    }
    
    
    private bool _isLocked;
    public bool IsLocked => _isLocked;

    public void Lock(UserRole role)
    {
        if (role != UserRole.Admin)
            throw new InvalidOperationException("Only admin can lock case");

        if (_isLocked)
            return;

        _isLocked = true;
    }

}