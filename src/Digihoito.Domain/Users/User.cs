namespace Digihoito.Domain.Users;

public sealed class User
{
    private User() { } // EF

    public User(Guid id, string email, string passwordHash, string role)
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public Guid Id { get; private set; }
    public string Email { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;
    public string Role { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }
}