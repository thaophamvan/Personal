using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Commands;

namespace Diary.CQRS.CommandHandlers
{
    public interface ICommandHandler<TCommand> where TCommand : Command
    {
        void Execute(TCommand command);
    }
}
