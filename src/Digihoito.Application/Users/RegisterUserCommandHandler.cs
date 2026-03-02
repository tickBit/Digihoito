namespace Digihoito.Application.Users;
using Digihoito.Domain.Users;
using Digihoito.Application.Interfaces;

public class RegisterUserCommandHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IAppPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public RegisterUserCommandHandler(
        IUserRepository userRepository,
        IAppPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<TokenResponse> Handle(
        RegisterUserCommand command,
        CancellationToken cancellationToken)
    {
        var passwordHash = _passwordHasher.HashPassword(command.Password);

        var user = User.Create(
            command.Email,
            passwordHash,
            command.Role);

        await _userRepository.AddAsync(user, cancellationToken);

        var token = _jwtTokenService.GenerateToken(
            user.Id,
            user.Role.ToString(),
            user.Email);

        return new TokenResponse(token);
    }
}