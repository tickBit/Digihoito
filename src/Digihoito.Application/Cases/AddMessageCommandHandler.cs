using Digihoito.Domain.Cases;

namespace Digihoito.Application.Cases {
public class AddMessageCommandHandler
{
    private  ICaseRepository _repository;
    
    public AddMessageCommandHandler(ICaseRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(AddMessageCommand command, CancellationToken cancellationToken)
    {
        Console.WriteLine(command.CaseId);
        
        var patientCase = await _repository.GetByIdAsync(
            command.CaseId,
            cancellationToken);
        
        if (patientCase == null)
            throw new InvalidOperationException("Case not found");
   
        patientCase.AddMessage(
            command.SenderId,
            command.Content,
            command.Role);
    
        var message = patientCase.Messages.Last();
        
        await _repository.AddMessageAsync(message, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        
    }
}
}