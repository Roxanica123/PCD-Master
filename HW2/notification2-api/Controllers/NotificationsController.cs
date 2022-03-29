using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using notification2_api.Events;
using notification2_api.Hubs;

namespace notification2_api.Controllers;

[ApiController]
[Route("api/v1/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly UserConnections connections;
    private readonly GoogleDataStore store;
    private readonly IHubContext<NotificationsHub> hub;
    private readonly ILogger<NotificationsController> logger;

    public NotificationsController(
        GoogleDataStore store, 
        ILogger<NotificationsController> logger, 
        IHubContext<NotificationsHub> hub, 
        UserConnections connections)
    {
        this.store = store;
        this.logger = logger;
        this.hub = hub;
        this.connections = connections;
    }

    [HttpPost("pubsub/price-estimate")]
    public async Task<IActionResult> NotifyMessage([FromBody] EventModel model)
    {
        var data = model.Data;
        logger.LogInformation(data);
        var information = JsonConvert.DeserializeObject<PriceUpdatedEvent>(data);

        var connectionsToReceiveNotification = await GetConnections(information.Data.Id);
        await hub.Clients.Clients(connectionsToReceiveNotification).SendCoreAsync("price-updated", new[] { data });

        return NoContent();
    }

    [HttpPost("pubsub/auction/notifications")]
    public async Task<IActionResult> NotifyAuctionMessage([FromBody] EventModel model)
    {
        var data = model.Data;
        logger.LogInformation(data);
        var productInfo = JsonConvert.DeserializeObject<NotificationEvent>(data);

        var connectionsToReceiveNotification = await GetConnections(productInfo.ProductId);
        await hub.Clients.Clients(connectionsToReceiveNotification).SendCoreAsync("bidding-info", new[] { data });

        return NoContent();
    }

    [HttpPost("pubsub/auction/start")]
    public async Task<IActionResult> NotifyAuctionStart([FromBody] EventModel model)
    {
        var data = model.Data;
        logger.LogInformation(data);

        var connectionsToReceiveNotification = await GetConnections(data);
        await hub.Clients.Clients(connectionsToReceiveNotification).SendCoreAsync("auction-started", new[] { new { productId = data } });


        return NoContent();
    }

    private async Task<IEnumerable<string>> GetConnections(string productId)
    {
        var users = await store.GetForProduct(productId);
        var userIds = users.Select(x => x.UserId).ToList();

        return connections.Connections
            .Where(conn => userIds.Contains(conn.Value))
            .Select(conn => conn.Key);
    } 
}
