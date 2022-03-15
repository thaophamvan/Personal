using System;

namespace ExampleAggregateRoot
{
    public class ExampleAr : AggregateRootBase
    {
        private Guid _id;
        private int _runningTotal;

        public override Guid Id
        {
            get { return _id; }
        }

        // #######################################
        // All public methods are accompanied by the private version where the state change actually occures.
        // This is the bit that allows the state to be re-created by applying the previous events.
        public void CreatExampleAr(CreateExampleAr command)
        {
            ApplyChange(new ExampleArCreated(command.AggregateId, command.ProcessId));
        }

        private void Apply(ExampleArCreated e)
        {
            _id = e.AggregateId;
        }
        // #######################################

        public void AddNumber(AddNumber command)
        {
            Guard();

            // _runningTotal += command.Number; // No state changes should occur in the first phase
            int newTotal = _runningTotal + command.Number;

            ApplyChange(new NumberAdded(command.AggregateId, newTotal, command.Number, command.Version, command.ProcessId));
        }

        private void Apply(NumberAdded e)
        {
            _runningTotal = e.RunningTotal;
        }

        private void Guard()
        {
            if (_id == Guid.Empty) throw new Exception("Aggregate not created");
        }
    }

    // Here are the commands used to drive the application. Each command can generate 0 to many events.

    public class CreateExampleAr : Command
    {
        public readonly Guid AggregateId;

        public CreateExampleAr(Guid aggregateId)
        {
            AggregateId = aggregateId;
        }
    }

    public class ExampleArCreated : Event
    {
        public readonly Guid AggregateId;

        public ExampleArCreated(Guid aggregateId, Guid processId)
            : base(processId)
        {
            AggregateId = aggregateId;
        }
    }


    public class AddNumber : Command
    {
        public readonly Guid AggregateId;
        public readonly int Version;
        public readonly int Number;


        public AddNumber(Guid aggregateId, int number, int version)
        {
            AggregateId = aggregateId;
            Number = number;
            Version = version;
        }
    }

    public class NumberAdded : Event
    {
        public readonly Guid AggregateId;
        public readonly int RunningTotal;
        public readonly int LastNumberAdded;

        public NumberAdded(Guid aggregateId, int runningTotal, int lastNumberAdded, int version, Guid processId)
            : base(processId)
        {
            AggregateId = aggregateId;
            RunningTotal = runningTotal;
            LastNumberAdded = lastNumberAdded;
            Version = version;
        }
    }
}
