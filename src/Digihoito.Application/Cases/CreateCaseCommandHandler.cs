
using Digihoito.Domain.Cases;

namespace Digihoito.Application.Cases;
public class CreateCaseCommandHandler
{
    private ICaseRepository _repository;

    public CreateCaseCommandHandler(ICaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateCaseCommand command, CancellationToken cancellationToken)
    {
        var patientCase = PatientCase.Create(
            command.PatientId,
            command.Subject,
            command.InitialMessage);

        await _repository.AddAsync(patientCase, cancellationToken);

        return patientCase.Id;
    }
    
}