using Digihoito.Domain.Users;
namespace Digihoito.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}