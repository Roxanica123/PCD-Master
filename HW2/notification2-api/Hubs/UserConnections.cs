namespace notification2_api.Hubs;

public class UserConnections
{
    public readonly Dictionary<string, string> Connections = new();

    public void Set(string userId, string connectionId)
    {
        Connections[connectionId] = userId;
    }

    public void Remove(string connectionId)
    {
        Connections.Remove(connectionId);
    }
}