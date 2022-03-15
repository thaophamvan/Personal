using System;
using System.Collections.Generic;
using System.Linq;

namespace ExampleAggregateRoot
{
    public abstract class AggregateRootBase
    {
        private readonly List<Event> _changes = new List<Event>();

        public abstract Guid Id { get; }
        public int Version { get; internal set; }

        public IEnumerable<Event> GetUncommittedChanges()
        {
            return _changes;
        }

        public void MarkChangesAsCommitted()
        {
            _changes.Clear();
        }

        public void LoadsFromHistory(IEnumerable<Event> history)
        {
            int index = 0;
            try
            {
                IList<Event> enumerable = history as IList<Event> ?? history.ToList();
                for (int i = 0; i < enumerable.Count(); i++)
                {
                    index = i;
                    ApplyChange(enumerable[i], false);
                }
            }
            catch (Exception e)
            {
                throw new LoadFromHistoryException(e.Message, Id, history, index, e);
            }

            Version = index;
        }


        protected void ApplyChange(Event @event)
        {
            ApplyChange(@event, true);
        }

        private void ApplyChange(Event @event, bool isNew)
        {
            this.AsDynamic().Apply(@event);
            if (isNew) _changes.Add(@event);
        }
     
    }

    public class LoadFromHistoryException : Exception
    {
        public string InternalMessage;
        public Guid AggregateId;
        public IEnumerable<Event> EventStream;
        public int FailedonIndex;
        public Exception ActualException;

        public LoadFromHistoryException(string internalMessage, Guid aggregateId, IEnumerable<Event> events, int failedOnIndex, Exception e)
            : base(internalMessage)
        {
            InternalMessage = internalMessage;
            AggregateId = aggregateId;
            EventStream = events;
            FailedonIndex = failedOnIndex;
            ActualException = e;
        }
    }
}
