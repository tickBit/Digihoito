using System.Net;
using System.Text.Json;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (InvalidOperationException ex)
        {
            await HandleException(context, ex.Message, HttpStatusCode.BadRequest);
        }
        catch (UnauthorizedAccessException ex)
        {
            await HandleException(context, ex.Message, HttpStatusCode.Unauthorized);
        }
        catch (Exception)
        {
            await HandleException(context, "Internal server error", HttpStatusCode.InternalServerError);
        }
    }

    private static async Task HandleException(
        HttpContext context,
        string message,
        HttpStatusCode statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var result = JsonSerializer.Serialize(new
        {
            error = message
        });

        await context.Response.WriteAsync(result);
    }
}