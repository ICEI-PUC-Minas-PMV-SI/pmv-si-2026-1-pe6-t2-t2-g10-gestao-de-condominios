using System.Security.Cryptography;
using SmartSindico.Application.Interfaces.Security;

namespace SmartSindico.Infrastructure.Security;

public sealed class PasswordHasher : IPasswordHasher
{
    private const int SaltLength = 16;
    private const int KeyLength = 32;
    private const int Iterations = 100_000;

    public string Hash(string senha)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(senha);

        var salt = RandomNumberGenerator.GetBytes(SaltLength);
        var hash = Rfc2898DeriveBytes.Pbkdf2(senha, salt, Iterations, HashAlgorithmName.SHA256, KeyLength);

        return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string senha, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(senha) || string.IsNullOrWhiteSpace(passwordHash))
        {
            return false;
        }

        try
        {
            var parts = passwordHash.Split('.');
            if (parts.Length != 3 || !int.TryParse(parts[0], out var iterations))
            {
                return false;
            }

            var salt = Convert.FromBase64String(parts[1]);
            var expectedHash = Convert.FromBase64String(parts[2]);
            var currentHash = Rfc2898DeriveBytes.Pbkdf2(senha, salt, iterations, HashAlgorithmName.SHA256, expectedHash.Length);

            return CryptographicOperations.FixedTimeEquals(currentHash, expectedHash);
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
