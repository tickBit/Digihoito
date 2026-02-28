using Digihoito.Domain.Users;
using Digihoito.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

using Digihoito.Application.Cases.Queries;

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
    var caseQuery = _context.PatientCases
        .Where(c => c.Id == query.CaseId);

    if (query.Role == UserRole.User)
    {
        caseQuery = caseQuery
            .Where(c => c.PatientId == query.UserId);
    }

    return await caseQuery
        .Select(c => new CaseDto(
            c.Id,
            c.IsLocked,

            // 🔹 UNREAD COUNT
            query.Role == UserRole.Admin
                ? c.Messages.Count(m => !m.IsReadByAdmin)
                : c.Messages.Count(m => !m.IsReadByPatient),

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