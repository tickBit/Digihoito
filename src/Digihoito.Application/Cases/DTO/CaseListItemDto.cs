public record CaseListItemDto(
    Guid Id,
    DateTime CreatedAt,
    bool IsLocked,
    int UnreadCount,
    string? Subject
);