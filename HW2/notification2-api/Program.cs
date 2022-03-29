using System.Text;
using System.Text.Unicode;
using Microsoft.AspNetCore.Http.Connections;
using Newtonsoft.Json;
using notification2_api;
using notification2_api.Controllers;
using notification2_api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services
    .AddSingleton<UserConnections>()
    .AddScoped<GoogleDataStore>()
    .AddSwaggerGen()
    .AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app
    .Use(async (context, func) =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<NotificationsController>>();
        
        var stream = new MemoryStream();
        await context.Request.Body.CopyToAsync(stream);
        logger.LogInformation(Encoding.UTF8.GetString(stream.ToArray()));
        stream.Position = 0;
        context.Request.Body = stream;
        await func(context);
    })
    .UseCors(policyBuilder => policyBuilder
        .WithOrigins("http://localhost:4200", "https://localhost", "https://zoo-notifications.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials())
    .UseRouting()
    .UseHttpsRedirection()
    .UseAuthorization().UseEndpoints(endpoints =>
    {
        endpoints.MapHub<NotificationsHub>("/notifications");
        endpoints.MapControllers();
    });
app.Run();
