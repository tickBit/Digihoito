
using Digihoito.Domain.Cases;
using Microsoft.EntityFrameworkCore;

namespace Digihoito.Infrastructure.Persistence.Repositories
{
public class CaseRepository : ICaseRepository
{
    private readonly ApplicationDbContext _context;

    public CaseRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task AddAsync(PatientCase patientCase, CancellationToken token)
    {
        await _context.PatientCases.AddAsync(patientCase, token);
        await _context.SaveChangesAsync(token);
    }

    public async Task<PatientCase?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.PatientCases
            .Include(x => x.Messages)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddMessageAsync(Message message, CancellationToken cancellationToken) {
        await _context.Messages.AddAsync(message, cancellationToken);
    }
    
    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
}