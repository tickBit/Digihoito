using Digihoito.Domain.Users;
public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
}