using Digihoito.Domain.Users;
public class RegisterUserCommandHandler
{
    private readonly IUserRepository _repository;
    private readonly IPasswordHasher _hasher;

    public RegisterUserCommandHandler(
        IUserRepository repository,
        IPasswordHasher hasher)
    {
        _repository = repository;
        _hasher = hasher;
    }

    public async Task Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        if (await _repository.EmailExistsAsync(command.Email, cancellationToken))
            throw new InvalidOperationException("Email already exists.");

        var user = User.Register(
            Guid.NewGuid(),
            command.Email,
            _hasher.HashPassword(command.Password));

        await _repository.AddAsync(user, cancellationToken);
    }
}