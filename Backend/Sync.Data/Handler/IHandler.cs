using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Handler
{
    public interface IHandler<T, V> where T : class where V : class
    {
        IHandler<T, V> SetNext(IHandler<T, V> next);
        HandleResult<T> Handle(T requestT, V requestV);
    }
}