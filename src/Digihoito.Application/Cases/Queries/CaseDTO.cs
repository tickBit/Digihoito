public record CaseDto(
    Guid Id,
    bool IsLocked,
    IReadOnlyCollection<MessageDto> Messages);