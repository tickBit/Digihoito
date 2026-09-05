namespace Digihoito.Infrastructure.Queries;
using Digihoito.Application.Cases.Queries;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Domain.Users;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Data;
using Digihoito.Application.Cases.DTO;
using Digihoito.Domain.Cases;


public class GetAllCasesQueryHandler
{
    private readonly ApplicationDbContext _context;

    public GetAllCasesQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // return page number
    public async Task<JsonObject> Handle(
        GetAllCasesQuery request,
        CancellationToken cancellationToken)
    {
    var query = _context.PatientCases
        .Include(c => c.Messages)
        .AsQueryable();
    
    var cases = new List<PatientCase>();
    
    if (request.Role == UserRole.User) {
        cases = await query.Where(c => c.PatientId == request.UserId)
        .OrderByDescending(c => c.CreatedAt)
        .Skip((request.PageNumber - 1) * request.PageSize)
        .Take(request.PageSize)
        .ToListAsync(cancellationToken);
    } else if (request.Role == UserRole.Admin) {
        cases = await query.OrderByDescending(c => c.CreatedAt)
                           .Skip((request.PageNumber - 1) * request.PageSize)
                           .Take(request.PageSize)
                           .ToListAsync(cancellationToken);
    }
    
    int totalCount = 0;
    // get all cases with their properties
    if (request.Role == UserRole.Admin) {
        totalCount = await query.CountAsync();
    } else {
        // count patient cases related to this user only
        totalCount = await query.Where(c => c.PatientId == request.UserId).CountAsync();
    }
    
    var allCases = cases.Select(c =>
    {
        var subject = c.Subject;

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
    
    var jsonResp = new JsonObject
    {
        ["TotalCount"] = totalCount,
        ["Cases"] = JsonSerializer.SerializeToNode(allCases)
    };
    
    return jsonResp;
}
}