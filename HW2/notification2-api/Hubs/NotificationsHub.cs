using Microsoft.AspNetCore.SignalR;

namespace notification2_api.Hubs;

public class NotificationsHub : Hub
{
    private readonly UserConnections _connections;

    public NotificationsHub(UserConnections connections)
    {
        _connections = connections;
    }

    public override Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()!.Request.Query["userId"].First();
        var connectionId = Context.ConnectionId;

        _connections.Set(userId, connectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _connections.Remove(Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }
}