namespace Digihoito.Application.Interfaces;
public interface INotifyNewCase
{
    Task NotifyNewCase(Guid caseId);
}
