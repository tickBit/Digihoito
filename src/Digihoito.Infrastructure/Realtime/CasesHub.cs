using Microsoft.AspNetCore.SignalR;

public class CasesHub : Hub
{
    public async Task JoinCase(Guid caseId)
    {    
        await Groups.AddToGroupAsync(
            Context.ConnectionId,
            caseId.ToString()
        );
        
    }

    public async Task LeaveCase(Guid caseId)
    {
        await Groups.RemoveFromGroupAsync(
            Context.ConnectionId,
            caseId.ToString()
        );
    }
}