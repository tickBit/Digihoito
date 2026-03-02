namespace Digihoito.Application.Users;
using Digihoito.Domain.Users;
using Digihoito.Application.Interfaces;

public class LoginUserCommandHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IAppPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    public LoginUserCommandHandler(
        IUserRepository userRepository,
        IAppPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }   
    public Task<TokenResponse> Handle(
        LoginUserCommand command,
        CancellationToken cancellationToken)
    {
        var user = _userRepository.GetByEmailAsync(command.Email, cancellationToken).Result;

        if (user == null || !_passwordHasher.Verify(command.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var token = _jwtTokenService.GenerateToken(
            user.Id,
            user.Role.ToString(),
            user.Email);

        return Task.FromResult(new TokenResponse(token));
    }
    
    
}

