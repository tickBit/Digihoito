namespace Digihoito.Domain.Cases;

using Digihoito.Domain.Users;

public class MarkMessagesAsReadCommandHandler
{
    private readonly ICaseRepository _repository;

    public MarkMessagesAsReadCommandHandler(ICaseRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        MarkMessagesAsReadCommand command,
        CancellationToken cancellationToken)
    {
        var patientCase = await _repository
            .GetByIdAsync(command.CaseId, cancellationToken);

        if (patientCase == null)
            throw new InvalidOperationException("Case not found");

        foreach (var message in patientCase.Messages)
        {
            message.MarkAsRead(command.Role);
        }

        await _repository.SaveChangesAsync(cancellationToken);
    }
}