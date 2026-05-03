using Digihoito.Application.Cases.Queries;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Digihoito.Application.Cases.DTO;

namespace Digihoito.Infrastructure.Queries {
public class GetCaseQueryHandler
{
    private readonly ApplicationDbContext _context;

    public GetCaseQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CaseDto?> Handle(
        GetCaseQuery request,
        CancellationToken cancellationToken)
    {        
        var caseEntity = await _context.PatientCases
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(
                c => c.Id == request.CaseId,
                cancellationToken);

        if (caseEntity == null)
            return null;

        var messages = caseEntity.Messages.Select(m => new MessageDto(
                                                            m.Id,
                                                            request.CaseId,
                                                            m.SenderId,
                                                            m.SenderRole,
                                                            m.Content,
                                                            m.CreatedAt,
                                                            m.IsReadByAdmin,
                                                            m.IsReadByPatient));
                
        return new CaseDto(
    caseEntity.Id,
    caseEntity.IsLocked,
    request.Role == UserRole.Admin
        ? caseEntity.Messages.Count(m => !m.IsReadByAdmin)
        : caseEntity.Messages.Count(m => !m.IsReadByPatient),
    caseEntity.Subject!,
    caseEntity.Messages
        .OrderBy(m => m.CreatedAt)
        .Select(m => new MessageDto(
            m.Id,
            request.CaseId,
            m.SenderId,
            m.SenderRole,
            m.Content,
            m.CreatedAt,
            m.IsReadByAdmin,
            m.IsReadByPatient
        ))
        .ToList()
        );
    }
}
}