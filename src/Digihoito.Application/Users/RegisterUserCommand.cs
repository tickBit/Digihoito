using Digihoito.Domain.Users;

public record RegisterUserCommand(
    string Email,
    string Password,
    UserRole Role);