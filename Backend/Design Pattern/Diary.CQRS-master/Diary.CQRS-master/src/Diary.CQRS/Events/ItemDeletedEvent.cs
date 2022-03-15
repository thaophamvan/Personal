using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Events
{
    public class ItemDeletedEvent:Event
    {
        public ItemDeletedEvent(Guid aggregateId)
        {
            AggregateId = aggregateId;
        }
    }
}
