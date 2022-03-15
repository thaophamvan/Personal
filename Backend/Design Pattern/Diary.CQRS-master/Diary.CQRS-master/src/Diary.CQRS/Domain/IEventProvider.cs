using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Events;

namespace Diary.CQRS.Domain
{
    public interface IEventProvider
    {
        void LoadsFromHistory(IEnumerable<Event> history);
        IEnumerable<Event> GetUncommittedChanges();
    }
}
