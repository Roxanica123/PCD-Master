namespace notification2_api.Events;

public class PriceUpdatedEvent
{
    public PriceUpdatedContentEvent Data { get; set; }
}

public class PriceUpdatedContentEvent
{
    public string Id { get; set; }
    public int Price { get; set; }
}