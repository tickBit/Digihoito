public class LockCaseCommandHandler
{
    private readonly ICaseRepository _repository;

    public LockCaseCommandHandler(ICaseRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(LockCaseCommand command, CancellationToken cancellationToken)
    {
        var patientCase = await _repository.GetByIdAsync(
            command.CaseId,
            cancellationToken);

        if (patientCase == null)
            throw new InvalidOperationException("Case not found");

        patientCase.Lock(command.CaseId);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}