using Digihoito.Domain.Users;

namespace Digihoito.Application.Cases.Queries;

public record GetCaseQuery(
    Guid CaseId,
    Guid UserId,
    UserRole Role);