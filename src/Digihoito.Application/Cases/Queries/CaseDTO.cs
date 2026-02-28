public record CaseDto(
    Guid Id,
    bool IsLocked,
    int UnreadCount,
    IReadOnlyCollection<MessageDto> Messages);