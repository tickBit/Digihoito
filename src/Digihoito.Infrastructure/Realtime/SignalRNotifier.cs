using Digihoito.Application.Cases.DTO;
using Digihoito.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

public class SignalRNotifier : INotifyNewMessages
{
    private readonly IHubContext<CasesHub> _hubContext;

    public SignalRNotifier(IHubContext<CasesHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyMessagesUpdated(Guid caseId, List<MessageDto> messages)
    { 
        await _hubContext.Clients
            .Group(caseId.ToString())
            .SendAsync("ReceiveMessages", messages);
            
    }
   
}