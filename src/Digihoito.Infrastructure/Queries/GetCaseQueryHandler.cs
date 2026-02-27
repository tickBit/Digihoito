using Digihoito.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Digihoito.Infrastructure.Queries;

public class GetCaseQueryHandler
{
    private readonly ApplicationDbContext _context;

    public GetCaseQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CaseDto?> Handle(
        GetCaseQuery query,
        CancellationToken cancellationToken)
    {
        return await _context.PatientCases
            .Where(c => c.Id == query.CaseId)
            .Select(c => new CaseDto(
                c.Id,
                c.IsLocked,
                c.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new MessageDto(
                        m.Id,
                        m.SenderId,
                        m.Content,
                        m.CreatedAt,
                        m.IsReadByAdmin,
                        m.IsReadByPatient))
                    .ToList()
            ))
            .FirstOrDefaultAsync(cancellationToken);
    }
}