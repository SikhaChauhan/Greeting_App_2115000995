using NLog;
using NLog.Web;

var logger = NLog.LogManager.Setup().LoadConfigurationFromFile("nlog.config").GetCurrentClassLogger();
try {
    logger.Info("Starting application...");

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.

    builder.Services.AddControllers();

    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // Configure the HTTP request pipeline.

    app.UseSwagger();

    app.UseSwaggerUI();

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();

}

catch (Exception ex)
{
    logger.Error(ex, "Application stopped due to an exception.");
    throw;
}
finally
{
    NLog.LogManager.Shutdown(); // Ensure logs are flushed on application shutdown
}

