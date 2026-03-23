using Digihoito.Application.Cases.DTO;
using Digihoito.Domain.Cases;
using Digihoito.Domain.Users;

namespace Digihoito.Application.Interfaces;
public interface INotifyNewMessages
{
    Task NotifyMessagesUpdated(Guid caseId, List<MessageDto> messages);
}
