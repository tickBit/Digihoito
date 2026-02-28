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
    var patientCase = await _context.PatientCases
        .Include(c => c.Messages)
        .FirstOrDefaultAsync(
            c => c.Id == query.CaseId &&
            (query.Role == UserRole.Admin ||
             c.PatientId == query.UserId),
            cancellationToken);

    if (patientCase == null)
        return null;

    // 🔹 MARK AS READ (vain toisen osapuolen viestit)
    if (query.Role == UserRole.Admin)
    {
        foreach (var message in patientCase.Messages
                     .Where(m => m.SenderId == patientCase.PatientId &&
                                 !m.IsReadByAdmin))
        {
            message.MarkAsReadByAdmin();
        }
    }
    else
    {
        foreach (var message in patientCase.Messages
                     .Where(m => m.SenderId != patientCase.PatientId &&
                                 !m.IsReadByPatient))
        {
            message.MarkAsReadByPatient();
        }
    }

    await _context.SaveChangesAsync(cancellationToken);

    // 🔹 Lasketaan unread uudelleen (nyt 0)
    var unreadCount = query.Role == UserRole.Admin
        ? patientCase.Messages.Count(m =>
            m.SenderId == patientCase.PatientId &&
            !m.IsReadByAdmin)
        : patientCase.Messages.Count(m =>
            m.SenderId != patientCase.PatientId &&
            !m.IsReadByPatient);

    return new CaseDto(
        patientCase.Id,
        patientCase.IsLocked,
        unreadCount,
        patientCase.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.Content,
                m.CreatedAt,
                m.IsReadByAdmin,
                m.IsReadByPatient))
            .ToList());
    }
}