using Google.Cloud.Datastore.V1;

namespace notification2_api;

public class GoogleDataStore
{
    private readonly DatastoreDb db;
    private const string WatchList = nameof(WatchList);

    public GoogleDataStore()
    {
        db = DatastoreDb.Create("winter-justice-345019");
    }

    public async Task<List<WatchRegistration>> GetForProduct(string productId)
    {
        var query = new Query(WatchList)
        {
            Filter = Filter.Property("productId", productId, PropertyFilter.Types.Operator.Equal)
        };
        var results = await db.RunQueryAsync(query);

        return results.Entities.Select(x => new WatchRegistration
        {
            ProductId = x.Properties["productId"].StringValue,
            UserId = x.Properties["userId"].StringValue
        }).ToList();
    }
}