using System;
using NHibernate.Generics;

namespace MvpSample.Core.Domain
{
    public class Order : DomainObject<long>
    {
        /// <summary>
        /// This is a placeholder constructor for NHibernate.
        /// A no-argument constructor must be avilable for NHibernate to create the object.
        /// Be sure to call the "primary" constructor so the collections get wired up correctly.
        /// Instead of passing null to the primary constructor, I'd recommend passing a 
        /// "null object": http://www.cs.oberlin.edu/~jwalker/nullObjPattern/.
        /// (But passing null keeps things very simple for the example.)
        /// </summary>
        private Order() : this(null) {}

        /// <summary>
        /// Creates a valid order.
        /// </summary>
        public Order(Customer orderedBy) {
            // Entities must be wired up correctly before setting property values
            WireUpEntities();

            OrderedBy = orderedBy;
        }

        /// <summary>
        /// Sets up parent/child relationship add/remove scaffolding.  So if a child is 
        /// added to a parent, the parent automatically gets added to the child, and vice versa.
        /// </summary>
        private void WireUpEntities() {
            // Implement parent/child relationship add/remove scaffolding between Order and Customer
            _orderedBy = new EntityRef<Customer>(
                delegate(Customer customer) { customer.Orders.Add(this); },
                delegate(Customer customer) { customer.Orders.Remove(this); }
                );
        }

        public DateTime OrderDate {
            get { return orderDate; }
            set { orderDate = value; }
        }

        public string ShipToName {
            get { return shipToName; }
            set { shipToName = value; }
        }

        public Customer OrderedBy {
            get { return _orderedBy.Value; }
            set { _orderedBy.Value = value; }
        }

        private DateTime orderDate = DateTime.Now;
        private string shipToName = "";
        // NHibernate.Generics members must be named in the following format:  _camelCase
        private EntityRef<Customer> _orderedBy;
    }
}
