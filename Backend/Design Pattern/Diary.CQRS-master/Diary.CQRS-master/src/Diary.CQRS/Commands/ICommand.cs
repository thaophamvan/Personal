using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Commands
{
    public interface ICommand
    {
        Guid Id { get; }
    }
}
