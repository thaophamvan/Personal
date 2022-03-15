using ThaoPham.Web.Business.Iterable.Services;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Handler;
using EPiServer.ServiceLocation;
using Newtonsoft.Json;
using System;

public abstract class Handler<T, V> : IHandler<T, V> where T : class where V : class
{
    protected static readonly IIterableUserService iterableService = ServiceLocator.Current.GetInstance<IIterableUserService>();
    private IHandler<T, V> Next { get; set; }
    public virtual HandleResult<T> Handle(T requestT, V requestV)
    {
        return Next?.Handle(requestT, requestV);
    }
    public IHandler<T, V> SetNext(IHandler<T, V> next)
    {
        return Next = next;
    }

    public Tobject ConvertToObject<Tobject>(object objectData)
    {
        var json = JsonConvert.SerializeObject(objectData);

        return JsonConvert.DeserializeObject<Tobject>(json);
    }
   
    public string GetSafeDate(string date)
    {
        if (int.TryParse(date, out int tick))
        {
            return new DateTime(tick).ToString("yyyy-MM-dd HH:mm:ss");
        }
        else
        {
            DateTime dateValue;
            var result = DateTime.TryParse(date, out dateValue);
            if (result)
            {
                return dateValue.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else
            {
                return DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
            }
        }
    }
    public int GetSafeInt(string value)
    {
        if (int.TryParse(value, out int v))
        {
            return v;
        }
        else
        {
            return 0;
        }
    }
    public bool GetSafeBoolean(string value)
    {
        bool b;
        bool.TryParse(value, out b);
        return b;
    }
    public bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}