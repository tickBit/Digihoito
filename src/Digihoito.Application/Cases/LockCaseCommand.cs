using Digihoito.Domain.Users;

public record LockCaseCommand(
    Guid CaseId,
    UserRole Role);