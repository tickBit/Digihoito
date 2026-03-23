using System.Net;
using Digihoito.Application.Cases.DTO;
using Digihoito.Application.Interfaces;
using Digihoito.Domain.Cases;
using Digihoito.Domain.Users;

namespace Digihoito.Application.Cases {
public class AddMessageCommandHandler
{
    private  ICaseRepository _repository;
    private readonly INotifyNewMessages _notifier;

    public AddMessageCommandHandler(ICaseRepository repository, INotifyNewMessages notifier)
    {
        _repository = repository;
        _notifier = notifier;
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

        var message = patientCase.Messages.Last();

        await _repository.AddMessageAsync(message, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

            var messages = patientCase.Messages
            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.SenderRole,
                m.Content,
                m.CreatedAt,
                UserRole.Admin == m.SenderRole,
                UserRole.User == m.SenderRole
            ))
            .ToList();

            await _notifier.NotifyMessagesUpdated(
                command.CaseId,
                messages
            );
    }
}
}