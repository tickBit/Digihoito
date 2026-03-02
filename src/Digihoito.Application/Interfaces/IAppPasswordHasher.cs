public interface IAppPasswordHasher
{
    string HashPassword(string password);
    bool Verify(string password, string hash);
}