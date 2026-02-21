namespace Digihoito.Application.Cases;

public class AddMessageCommandHandler
{
    private readonly ICaseRepository _repository;

    public AddMessageCommandHandler(ICaseRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(AddMessageCommand command, CancellationToken cancellationToken)
    {
        var patientCase = await _repository.GetByIdAsync(
            command.CaseId,
            cancellationToken);

        if (patientCase == null)
            throw new InvalidOperationException("Case not found");

        patientCase.AddMessage(
            command.SenderId,
            command.Content,
            command.Role);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}