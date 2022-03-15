using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Commands;

namespace Diary.CQRS.Messaging
{
    public interface ICommandBus
    {
        void Send<T>(T command) where T : Command;

    }
}
