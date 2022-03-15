using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Events
{
    public interface IHandle<TEvent> where TEvent:Event
    {
        void Handle(TEvent e);
    }
}
