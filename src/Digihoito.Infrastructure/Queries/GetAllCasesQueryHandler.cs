namespace Digihoito.Infrastructure.Queries;
using Digihoito.Application.Cases.Queries;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Digihoito.Application.Cases.DTO;

public class GetAllCasesQueryHandler
{
    private readonly ApplicationDbContext _context;

    public GetAllCasesQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CaseDto>> Handle(
    GetAllCasesQuery request,
    CancellationToken cancellationToken)
{
    var query = _context.PatientCases
        .Include(c => c.Messages)
        .AsQueryable();

    if (request.Role == UserRole.User)
    {
        query = query.Where(c => c.PatientId == request.UserId);
    }

    var cases = await query
        .OrderByDescending(c => c.CreatedAt)
        .ToListAsync(cancellationToken);

    return cases.Select(caseEntity =>
        new CaseDto(
            caseEntity.Id,
            caseEntity.IsLocked,
            request.Role == UserRole.Admin
                ? caseEntity.Messages.Count(m => !m.IsReadByAdmin)
                : caseEntity.Messages.Count(m => !m.IsReadByPatient),
            caseEntity.Messages
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto(
                    m.Id,
                    m.SenderId,
                    m.SenderRole,
                    m.Content,
                    m.CreatedAt,
                    m.IsReadByAdmin,
                    m.IsReadByPatient
                ))
                .ToList()
        )
    ).ToList();
}
}