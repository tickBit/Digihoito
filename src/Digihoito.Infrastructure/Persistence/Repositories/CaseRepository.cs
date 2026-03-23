
using System.Runtime.Intrinsics.X86;
using System.Security.Cryptography.X509Certificates;
using Digihoito.Domain.Cases;
using Digihoito.Domain.Users;
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
    
    public async Task<int> GetUnreadCountAsync(
    Guid caseId,
    Guid userId,
    CancellationToken ct)
    {
        // selvitä rooli (jos ei ole jo tiedossa handlerissa)
        var userRole = await _context.PatientCases
            .Where(c => c.Id == caseId)
            .SelectMany(c => c.Messages)
            .Where(m => m.SenderId == userId)
            .Select(m => m.SenderRole)
            .FirstOrDefaultAsync(ct);

        return await _context.Messages
            .Where(m => m.PatientCaseId == caseId)
            .Where(m => m.SenderId != userId)
            .Where(m =>
                userRole == UserRole.Admin
                    ? m.IsReadByAdmin == false
                    : m.IsReadByPatient == false
            )
            .CountAsync(ct);
    }
}
}