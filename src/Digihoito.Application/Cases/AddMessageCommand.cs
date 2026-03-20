namespace Digihoito.Application.Cases;

using Digihoito.Domain.Users;
public record AddMessageCommand(
    Guid CaseId,
    Guid SenderId,
    string Content,
    UserRole Role
    );