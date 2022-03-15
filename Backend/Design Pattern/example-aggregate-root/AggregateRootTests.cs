using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace ExampleAggregateRoot
{
    public class AggregateRootTests
    {
        readonly Guid AggregatedId = Guid.NewGuid();

        [Test]
        public void CreateExampleAr_WithValidCommand_ArCreated()
        {
            
            var sut = new ExampleAr();

            sut.CreatExampleAr(new CreateExampleAr(AggregatedId));

            Assert.AreEqual(AggregatedId, sut.Id);
            Assert.AreEqual(1, sut.GetUncommittedChanges().Count());
        }

        [Test]
        public void AddNumber_BeforeArCreated_ShouldThrowException()
        {
            Exception actual = null;

            var sut = new ExampleAr();

            try
            {
                sut.AddNumber(new AddNumber(AggregatedId, 1, 1));
            }
            catch (Exception e)
            {
                actual = e;
            }

            Assert.NotNull(actual);
        }

        [Test]
        public void AddNumber_FirstNumber_ShouldHaveRunningTotalOf1()
        {
            var previousEvents = new List<Event>
                                             {
                                                 new ExampleArCreated(AggregatedId, Guid.Empty)
                                             };
            ExampleAr exampleAr = CreateSut(previousEvents);
            
            exampleAr.AddNumber(new AddNumber(AggregatedId, 1, 1));

            IEnumerable<Event> uncommittedChanges = exampleAr.GetUncommittedChanges();
            Assert.AreEqual(((NumberAdded)uncommittedChanges.First()).RunningTotal, 1);
        }

        [Test]
        public void AddNumber_PreviouslyAddedNumber_RunningTotalShould2()
        {
            // This test ensures the state changes in the private apply method. 
            // It does this by loading from history. 
            var previousEvents = new List<Event>
                                             {
                                                 new ExampleArCreated(AggregatedId, Guid.NewGuid()),
                                                 new NumberAdded(AggregatedId, 1, 1, 1, Guid.NewGuid())
                                             };
            ExampleAr exampleAr = CreateSut(previousEvents);

            exampleAr.AddNumber(new AddNumber(AggregatedId, 2, 1));

            IEnumerable<Event> uncommittedChanges = exampleAr.GetUncommittedChanges();
            Assert.AreEqual(((NumberAdded)uncommittedChanges.First()).LastNumberAdded, 2); 
            Assert.AreEqual(((NumberAdded)uncommittedChanges.First()).RunningTotal, 3);
        }

        // Handy utility method
        private ExampleAr CreateSut(IEnumerable<Event> previousEvents)
        {
            var exampleAr = new ExampleAr();
            exampleAr.LoadsFromHistory(previousEvents);
            return exampleAr;
        }
    }

    
}
