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

    public async Task<List<CaseListItemDto>> Handle(
    GetAllCasesQuery request,
    CancellationToken cancellationToken)
{
    var query = _context.PatientCases.Include(c => c.Messages).AsQueryable();
        
    if (request.Role == UserRole.User)
    {
        query = query.Where(c => c.PatientId == request.UserId);
    }

    var cases = await query
        .OrderByDescending(c => c.CreatedAt)
        .ToListAsync(cancellationToken);
    
    return cases.Select(c =>
{
    
    var subject= c.Subject;
    
    return new CaseListItemDto(
        c.Id,
        c.CreatedAt,
        c.IsLocked,
        request.Role == UserRole.Admin
            ? c.Messages.Count(m => !m.IsReadByAdmin)
            : c.Messages.Count(m => !m.IsReadByPatient),
        subject
    );
}).ToList();
}
}