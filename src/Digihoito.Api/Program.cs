using Microsoft.EntityFrameworkCore;
using Digihoito.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapPost("/register", async (
    RegisterUserCommand command,
    RegisterUserCommandHandler handler,
    CancellationToken token) =>
{
    await handler.Handle(command, token);
    return Results.Ok();
});

app.Run();
