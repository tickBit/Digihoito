public record CreateCaseCommand(
    Guid PatientId,
    string Subject,
    string InitialMessage);