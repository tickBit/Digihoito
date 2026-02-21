using Digihoito.Domain.Users;
public record AddMessageCommand(
    Guid CaseId,
    Guid SenderId,
    UserRole Role,
    string Content);