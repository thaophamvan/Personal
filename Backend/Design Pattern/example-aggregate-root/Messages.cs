using System;

namespace ExampleAggregateRoot
{
    public interface IMessage
    {
    }

    public abstract class Command : IMessage
    {
        public readonly Guid ProcessId;
        public readonly DateTime IssuedAt;

        public Command()
        {
            ProcessId = Guid.NewGuid();
            IssuedAt = DateTime.Now;
        }

        public Command(Guid processId)
        {
            ProcessId = processId;
            IssuedAt = DateTime.Now;
        }
    }

    public class Event : IMessage
    {
        public int Version;
        public DateTime DateCreated { get; set; }
        public readonly Guid ProcessId;

        protected Event(Guid processId)
        {
            ProcessId = processId;
            DateCreated = DateTime.Now;
        }
    }
}
