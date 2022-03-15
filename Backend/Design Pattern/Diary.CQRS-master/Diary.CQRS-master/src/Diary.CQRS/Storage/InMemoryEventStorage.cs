using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Domain;
using Diary.CQRS.Domain.Mementos;
using Diary.CQRS.Events;
using Diary.CQRS.Messaging;
using Diary.CQRS.Storage.Memento;
using Diary.CQRS.Utils;

namespace Diary.CQRS.Storage
{
    public class InMemoryEventStorage:IEventStorage
    {
        private List<Event> _events;
        private List<BaseMemento> _mementoes;
        private readonly IEventBus _eventBus;

        public InMemoryEventStorage(IEventBus eventBus)
        {
            _events=new List<Event>();
            _mementoes=new List<BaseMemento>();
            _eventBus = eventBus;
        }

        public IEnumerable<Event> GetEvents(Guid aggregateId)
        {
            var events = _events.Where(p => p.AggregateId == aggregateId);
            if (events.Count()==0)
            {
                throw new Exception();
            }
            return events;
        }

        public void Save(AggregateRoot aggregate)
        {
            var uncommittedChanges = aggregate.GetUncommittedChanges();
            var version = aggregate.Version;

            foreach (var @event in uncommittedChanges)
            {
                version++;
                if (version>2)
                {
                    if (version%3==0)
                    {
                        var originator = (IOriginator) aggregate;
                        var memento = originator.GetMemento();
                        memento.Version = version;
                        SaveMemento(memento);
                    }
                }
                @event.Version = version;
                _events.Add(@event);
            }
            foreach (var @event in uncommittedChanges)
            {
                var desEvent = Converter.ChangeTo(@event, @event.GetType());
                _eventBus.Publish(desEvent);
            }
        }

        public T GetMemento<T>(Guid aggregateId) where T : BaseMemento
        {
            var memento = _mementoes.Where(m => m.Id == aggregateId).Select(m=>m).LastOrDefault();
            if (memento!=null)
            {
                return (T) memento;
            }
            return null;
        }

        public void SaveMemento(BaseMemento memento)
        {
            _mementoes.Add(memento);
        }
    }
}
