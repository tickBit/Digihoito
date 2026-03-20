namespace Digihoito.Application.Cases.DTO;

public record CaseDto(
    Guid Id,
    bool IsLocked,
    int UnreadCount,
    string Subject,
    ICollection<MessageDto> Messages);