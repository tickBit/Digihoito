namespace Digihoito.Infrastructure.Queries;
using Digihoito.Application.Cases.Queries;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Digihoito.Application.Cases.DTO;

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
        Console.WriteLine(request);
        
        var caseEntity = await _context.PatientCases
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(
                c => c.Id == request.CaseId,
                cancellationToken);

        if (caseEntity == null)
            return null;

        return new CaseDto(
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
        );
    }
}