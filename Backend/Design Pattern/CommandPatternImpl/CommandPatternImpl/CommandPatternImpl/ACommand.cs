using System;
using System.Collections.Generic;
using System.Text;

namespace CommandPatternImpl
{
    abstract class ACommand
    {
        protected IReciever reciever_ = null;

        public ACommand(IReciever reciever)
        {
            reciever_ = reciever;
        }

        public abstract int Execute();
    }
}
