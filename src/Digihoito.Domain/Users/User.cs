namespace Digihoito.Domain.Users;

public sealed class User
{
    private User() { } // EF

    public User(Guid id, string email, string passwordHash, UserRole role)
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public static User Register(Guid id, string email, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty.");

        return new User(id, email, passwordHash, UserRole.User);
    }
    
    public Guid Id { get; private set; }
    public string Email { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;
    public UserRole Role { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }

    public bool IsAdmin() => Role == UserRole.Admin;
}