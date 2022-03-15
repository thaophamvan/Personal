using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Commands
{
    public class Command:ICommand
    {
        public Guid Id { get; private set; }
        public int Version { get; set; }

        public Command(Guid id, int version)
        {
            Id = id;
            Version = version;
        }
    }
}
