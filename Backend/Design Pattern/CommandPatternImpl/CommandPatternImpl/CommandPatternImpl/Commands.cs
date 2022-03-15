using System;
using System.Collections.Generic;
using System.Text;

namespace CommandPatternImpl
{
    class AddCommand : ACommand
    {
        public AddCommand(IReciever reciever)
            :base(reciever)
        {

        }
        public override int Execute()
        {
            reciever_.SetAction(ACTIO_LIST.ADD);
            return reciever_.GetResult();
        }
    }

    class SubtractCommand : ACommand
    {
        public SubtractCommand(IReciever reciever)
            : base(reciever)
        {

        }
        public override int Execute()
        {
            reciever_.SetAction(ACTIO_LIST.SUBTRACT);
            return reciever_.GetResult();
        }
    }

    class MultiplyCommand : ACommand
    {
        public MultiplyCommand(IReciever reciever)
            : base(reciever)
        {

        }
        public override int Execute()
        {
            reciever_.SetAction(ACTIO_LIST.MULTIPLY);
            return reciever_.GetResult();
        }
    }
}
