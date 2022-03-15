using System;
using System.Collections.Generic;
using System.Text;

namespace MvpSample.Core.Domain
{
    public abstract class DomainObject<IdT>
    {
        /// <summary>
        /// ID may be of type string, int, custom type, etc.
        /// </summary>
        public IdT ID {
            get { return id; }
            set { id = value; }
        }

        /// <summary>
        /// Transient objects are not associated with an item already in storage.  For instance,
        /// a <see cref="User" /> is transient if its ID is 0.
        /// </summary>
        public bool IsTransient() {
            return ID == null || ID.Equals(default(IdT));
        }

        private IdT id = default(IdT);
    }
}
