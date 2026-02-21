using System.Security.Claims;
using Digihoito.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


using Digihoito.Domain.Users;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Hello World!");

app.MapPost("/register", async (
    RegisterUserCommand command,
    RegisterUserCommandHandler handler,
    CancellationToken token) =>
{
    await handler.Handle(command, token);
    return Results.Ok();
});

app.MapPost("/cases/{id}/messages", async (
    Guid id,
    string content,
    AddMessageCommandHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{
    var userId = Guid.Parse(
        user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    var role = Enum.Parse<UserRole>(
        user.FindFirst(ClaimTypes.Role)!.Value);

    var command = new AddMessageCommand(
        id,
        userId,
        role,
        content);

    await handler.Handle(command, token);

    return Results.Ok();
})
.RequireAuthorization();

app.MapPost("/cases", async (
    CreateCaseCommand command,
    CreateCaseCommandHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{
    var userId = Guid.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    var id = await handler.Handle(
        command with { PatientId = userId },
        token);

    return Results.Ok(id);
})
.RequireAuthorization(policy => policy.RequireRole("Patient"));

app.MapPost("/cases/message", async (
    CreateCaseCommand command,
    CreateCaseCommandHandler handler,
    CancellationToken token) =>
{
    await handler.Handle(command, token);
    return Results.Ok();
});

app.MapPost("/cases/{id}/lock", async (
    Guid id,
    LockCaseCommandHandler handler,
    CancellationToken token) =>
{
    await handler.Handle(id, token);
    return Results.Ok();
})
.RequireAuthorization(policy => policy.RequireRole("Admin"));

app.Run();
