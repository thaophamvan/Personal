using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Events;
using Diary.CQRS.Utils;

namespace Diary.CQRS.Domain
{
    public abstract class AggregateRoot:IEventProvider
    {
        private readonly List<Event> _changes;

        public Guid Id { get; set; }
        public int Version { get; set; }
        public int EventVersion { get; set; }

        protected AggregateRoot()
        {
            _changes=new List<Event>();
        }

        public void MarkChangesAsCommitted()
        {
            _changes.Clear();
        }







        public void LoadsFromHistory(IEnumerable<Event> history)
        {
            foreach (var e in history)
            {
                ApplyChange(e,false);
            }
            Version = history.Last().Version;
            EventVersion = Version;
        }


        protected void ApplyChange(Event @event)
        {
            ApplyChange(@event,true);
        }

        protected void ApplyChange(Event @event,bool isNew)
        {
            dynamic d = this;
            d.Handle(Converter.ChangeTo(@event, @event.GetType()));
            if (isNew)
            {
                _changes.Add(@event);
            }
        }


        public IEnumerable<Event> GetUncommittedChanges()
        {
            return _changes;
        }
    }
}
