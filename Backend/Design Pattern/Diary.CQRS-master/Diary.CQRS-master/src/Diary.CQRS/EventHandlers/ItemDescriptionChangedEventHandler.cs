using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Events;
using Diary.CQRS.Reporting;

namespace Diary.CQRS.EventHandlers
{
    public class ItemDescriptionChangedEventHandler:IEventHandler<ItemDescriptionChangedEvent>
    {
        private readonly IReportDatabase _reportDatabase;

        public ItemDescriptionChangedEventHandler(IReportDatabase reportDatabase)
        {
            _reportDatabase = reportDatabase;
        }

        public void Handle(ItemDescriptionChangedEvent e)
        {
            var item = _reportDatabase.GetById(e.AggregateId);
            item.Description = e.Description;
            item.Version = e.Version;
        }
    }
}
