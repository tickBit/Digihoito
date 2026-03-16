namespace Digihoito.Application.Cases.Queries;

using Digihoito.Domain.Users;

public record GetAllCasesQuery(
    Guid UserId,
    UserRole Role);