using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Domain.Mementos
{
    public class BaseMemento
    {
        public Guid Id { get; set; }
        public int Version { get; set; }
    }
}
