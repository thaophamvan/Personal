using System;

namespace PI.Core.BaseClass
{
    public abstract class PersistentEntity
    {
        public bool Deleted { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
