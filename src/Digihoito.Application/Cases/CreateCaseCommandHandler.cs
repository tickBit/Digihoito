
using Digihoito.Application.Interfaces;
using Digihoito.Domain.Cases;

namespace Digihoito.Application.Cases;
public class CreateCaseCommandHandler
{
    private ICaseRepository _repository;
    private readonly INotifyNewCase _notifier;
    public CreateCaseCommandHandler(ICaseRepository repository, INotifyNewCase notifier)
    {
        _repository = repository;
        _notifier = notifier;
    }

    public async Task<Guid> Handle(CreateCaseCommand command, CancellationToken cancellationToken)
    {
        var patientCase = PatientCase.Create(
            command.PatientId,
            command.Subject,
            command.InitialMessage);

        await _repository.AddAsync(patientCase, cancellationToken);

        await _notifier.NotifyNewCase(patientCase.Id);
        
        return patientCase.Id;
    }
    
}