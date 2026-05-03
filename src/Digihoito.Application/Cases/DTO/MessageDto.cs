namespace Digihoito.Application.Cases.DTO;
using Digihoito.Domain.Users;

public record MessageDto(
    Guid Id,
    Guid caseId,
    Guid SenderId,
    UserRole SenderRole,
    string Content,
    DateTime CreatedAt,
    bool IsReadByAdmin,
    bool IsReadByPatient);