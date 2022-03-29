using System.Buffers.Text;
using System.Text;

namespace notification2_api.Events;

public class EventModel
{
    public EventModelContent Message { get; set; }

    public string Data => Encoding.UTF8.GetString(Message.Data);
}

public class EventModelContent
{
    public byte[] Data { get; set; }
}