public record CreateCaseCommand(
    Guid PatientId,
    string InitialMessage);