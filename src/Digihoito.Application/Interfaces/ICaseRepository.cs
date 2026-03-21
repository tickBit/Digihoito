using Digihoito.Domain.Cases;

public interface ICaseRepository
{
    Task AddAsync(PatientCase patientCase, CancellationToken cancellationToken);
    Task<PatientCase?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    
    Task AddMessageAsync(Message message, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);

}