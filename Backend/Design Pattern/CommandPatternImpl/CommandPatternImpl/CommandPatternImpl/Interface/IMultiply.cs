using System;
using System.Collections.Generic;
using System.Text;

namespace CommandPatternImpl
{
    enum ACTIO_LIST
    {        
        ADD,
        SUBTRACT,
        MULTIPLY
    }

    interface IReciever
    {
        void SetAction(ACTIO_LIST action);
        int GetResult();
    }
}
