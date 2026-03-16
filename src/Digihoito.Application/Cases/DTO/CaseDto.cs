namespace Digihoito.Application.Cases.DTO;

public record CaseDto(
    Guid Id,
    bool IsLocked,
    int UnreadCount,
    IReadOnlyCollection<MessageDto> Messages);