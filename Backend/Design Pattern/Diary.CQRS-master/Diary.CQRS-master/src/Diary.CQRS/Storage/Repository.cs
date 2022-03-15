using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Domain;
using Diary.CQRS.Domain.Mementos;
using Diary.CQRS.Events;
using Diary.CQRS.Storage.Memento;

namespace Diary.CQRS.Storage
{
    public class Repository<T>:IRepository<T> where T:AggregateRoot,new()
    {
        private readonly IEventStorage _eventStorage;
        private static object _lock=new object();

        public Repository(IEventStorage eventStorage)
        {
            _eventStorage = eventStorage;
        } 

        public void Save(AggregateRoot aggregate, int expectedVersion)
        {
            if (aggregate.GetUncommittedChanges().Any())
            {
                lock (_lock)
                {
                    var item = new T();
                    if (expectedVersion!=-1)
                    {
                        item = GetById(aggregate.Id);
                        if (item.Version!=expectedVersion)
                        {
                            throw new Exception();
                        }
                    }
                    _eventStorage.Save(aggregate);
                }
            }
        }

        public T GetById(Guid id)
        {
            IEnumerable<Event> events;
            var memento = _eventStorage.GetMemento<BaseMemento>(id);
            if (memento!=null)
            {
                events = _eventStorage.GetEvents(id).Where(e => e.Version >= memento.Version);
            }
            else
            {
                events = _eventStorage.GetEvents(id);
            }
            var obj = new T();
            if (memento!=null)
            {
                ((IOriginator)obj).SetMemento(memento);
            }
            obj.LoadsFromHistory(events);
            return obj;
        }
    }
}
