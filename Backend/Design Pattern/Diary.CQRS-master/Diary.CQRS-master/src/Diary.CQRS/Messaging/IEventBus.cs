using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Events;

namespace Diary.CQRS.Messaging
{
    public interface IEventBus
    {
        void Publish<T>(T @event) where T : Event;
    }
}
