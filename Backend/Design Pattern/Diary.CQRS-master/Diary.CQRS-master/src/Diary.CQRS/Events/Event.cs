using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Events
{
    public class Event:IEvent
    {
        public int Version;
        public Guid AggregateId { get; set; }
        public Guid Id { get; private set; }
    }
}
