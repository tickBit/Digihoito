namespace Digihoito.Infrastructure.Persistence.Repositories;

using Digihoito.Domain.Cases;
using Microsoft.EntityFrameworkCore;

public class CaseRepository : ICaseRepository
{
    private readonly ApplicationDbContext _context;

    public CaseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(PatientCase patientCase, CancellationToken token)
    {
        await _context.PatientCases.AddAsync(patientCase, token);
        await _context.SaveChangesAsync(token);
    }

    public Task<PatientCase?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _context.PatientCases
            .Include(x => x.Messages)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}