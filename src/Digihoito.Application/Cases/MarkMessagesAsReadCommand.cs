using Digihoito.Domain.Users;

public record MarkMessagesAsReadCommand(
    Guid CaseId,
    UserRole Role);