public record MessageDto(
    Guid Id,
    Guid SenderId,
    string Content,
    DateTime CreatedAt,
    bool IsReadByAdmin,
    bool IsReadByPatient);