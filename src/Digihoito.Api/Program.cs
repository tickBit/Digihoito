using System.Security.Claims;
using System.Text;
using Digihoito.Application.Cases;
using Digihoito.Application.Cases.Queries;
using Digihoito.Domain.Users;
using Digihoito.Infrastructure.Persistence;
using Digihoito.Infrastructure.Persistence.Repositories;
using Digihoito.Infrastructure.Persistence.Security;
using Digihoito.Infrastructure.Queries;
using Digihoito.Application.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Digihoito.Domain.Cases;

var builder = WebApplication.CreateBuilder(args);

#region Database

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

#endregion

#region Handlers (DI)

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<RegisterUserCommandHandler>();
builder.Services.AddScoped<CreateCaseCommandHandler>();
builder.Services.AddScoped<AddMessageCommandHandler>();
builder.Services.AddScoped<MarkMessagesAsReadCommandHandler>();
builder.Services.AddScoped<GetCaseQueryHandler>();
builder.Services.AddScoped<LockCaseCommandHandler>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICaseRepository, CaseRepository>();
builder.Services.AddScoped<IAppPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<LoginUserCommandHandler>();

#endregion

#region Authentication

var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey!))
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
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
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

app.MapPost("/register", async (
    RegisterUserCommand command,
    RegisterUserCommandHandler handler,
    CancellationToken token) =>
    {
        var result = await handler.Handle(command, token);

        return Results.Ok(result);
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
    var userId = Guid.Parse(
        user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
    Console.WriteLine("Alku: "+command.InitialMessage);
    
    var id = await handler.Handle(
        command with { PatientId = userId },
        token);

    return Results.Ok(id);
})
.RequireAuthorization();

app.MapGet("/cases/{id}", async (
    Guid id,
    GetCaseQueryHandler handler,
    ClaimsPrincipal user,
    CancellationToken token) =>
{   
    var userId = Guid.Parse(
        user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    
    var role = Enum.Parse<UserRole>(
        user.FindFirst(ClaimTypes.Role)!.Value);
    
    var result = await handler.Handle(
        new GetCaseQuery(id, userId, role),
        token);
    
    return result is null
        ? Results.NotFound()
        : Results.Ok(result);
})
.RequireAuthorization();

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

#endregion

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    var passwordHasher = scope.ServiceProvider
        .GetRequiredService<IAppPasswordHasher>();

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

        Console.WriteLine("Admin user created.");
    }
}

app.Run();