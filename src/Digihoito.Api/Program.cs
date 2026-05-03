using System.Security.Claims;
using System.Text;
using Digihoito.Application.Cases;
using Digihoito.Application.Cases.Queries;
using Digihoito.Application.Users;
using Digihoito.Domain.Users;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Infrastructure.Persistence.Repositories;
using Digihoito.Infrastructure.Persistence.Security;
using Digihoito.Infrastructure.Queries;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.SignalR;
using Digihoito.Application.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Rekisteröidään DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2️⃣ Rekisteröidään repositoryt
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICaseRepository, CaseRepository>();
builder.Services.AddScoped<IAppPasswordHasher, PasswordHasher>();

// 3️⃣ Rekisteröidään handlers'
builder.Services.AddSignalR();

builder.Services.AddScoped<RegisterUserCommandHandler>();
builder.Services.AddScoped<LoginUserCommandHandler>();
builder.Services.AddScoped<CreateCaseCommandHandler>();
builder.Services.AddScoped<AddMessageCommandHandler>();
builder.Services.AddScoped<MarkMessagesAsReadCommandHandler>();
builder.Services.AddScoped<GetCaseQueryHandler>();
builder.Services.AddScoped<GetAllCasesQueryHandler>();
builder.Services.AddScoped<LockCaseCommandHandler>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<INotifyNewMessages, SignalRNotifier>();

#region Authentication

var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

builder.Services.AddAuthorization();

#endregion

#region CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

#endregion

var app = builder.Build();

#region Middleware

app.UseCors("Frontend");

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

#endregion

#region Endpoints

app.MapHub<CasesHub>("/hubs/cases");

app.MapPost("/register", async (
    RegisterUserCommand command,
    RegisterUserCommandHandler handler,
    CancellationToken token) =>
{
    var result = await handler.Handle(command, token);
    return Results.Ok(result);
});

app.MapPost("/login", async (
    LoginUserCommand command,
    LoginUserCommandHandler handler,
    CancellationToken token) =>
{
    var result = await handler.Handle(command, token);
    return result is null
        ? Results.Unauthorized()
        : Results.Ok(result);
});

app.MapPost("/cases", async (
    CreateCaseCommand command,
    CreateCaseCommandHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var id = await handler.Handle(command with { PatientId = userId }, token);
    return Results.Ok(id);
}).RequireAuthorization();

app.MapGet("/cases", async (
    GetAllCasesQueryHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var role = Enum.Parse<UserRole>(user.FindFirstValue(ClaimTypes.Role)!);

    var result = await handler.Handle(new GetAllCasesQuery(userId, role), token);
    
    return Results.Ok(result);
    
}).RequireAuthorization();

app.MapGet("/cases/{id}", async (
    Guid id,
    GetCaseQueryHandler handler,
    MarkMessagesAsReadCommandHandler commandHandler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var role = Enum.Parse<UserRole>(user.FindFirstValue(ClaimTypes.Role)!);

    var result = await handler.Handle(new GetCaseQuery(id, userId, role), token);
    
    if (result != null)
    {
        await commandHandler.Handle(new MarkMessagesAsReadCommand(id, role), token);
    }
    
    return result is null
        ? Results.NotFound()
        : Results.Ok(result);
}).RequireAuthorization();


app.MapPost("/cases/{id}/messages", async (
    Guid id,
    AddMessageRequestDto content,
    AddMessageCommandHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{    
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var role = Enum.Parse<UserRole>(user.FindFirstValue(ClaimTypes.Role)!);

    var command = new AddMessageCommand(
        CaseId: id,
        SenderId: userId,
        Role: role,
        Content: content.Content
    );

    await handler.Handle(command, token);
    return Results.Ok();
}).RequireAuthorization();

app.MapPost("/cases/{id}/read", async (
    Guid id,
    MarkMessagesAsReadCommandHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{    
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var role = Enum.Parse<UserRole>(user.FindFirstValue(ClaimTypes.Role)!);

    var command = new MarkMessagesAsReadCommand(
        CaseId: id,
        Role: role
    );

    await handler.Handle(command, token);

    return Results.Ok();
    
}).RequireAuthorization();

#endregion

#region Admin Initialization

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IAppPasswordHasher>();

    if (!context.Users.Any(u => u.Role == UserRole.Admin))
    {
        var admin = new User(
            Guid.NewGuid(),
            "admin@digihoito.local",
            passwordHasher.HashPassword("Admin123!"),
            UserRole.Admin
        );

        context.Users.Add(admin);
        context.SaveChanges();

    }
}

#endregion

app.Run();
