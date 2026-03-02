using Digihoito.Domain.Users;

public record LoginUserCommand(
    string Email,
    string Password,
    UserRole Role);