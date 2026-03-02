public interface IJwtTokenService
{
    string GenerateToken(Guid userId, string role, string email);
}