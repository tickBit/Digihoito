public record MessageDto(
    Guid Id,
    Guid SenderId,
    string SenderRole,
    string Content,
    DateTime CreatedAt,
    bool IsReadByAdmin,
    bool IsReadByPatient);