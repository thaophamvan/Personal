using System;

namespace DomainEventInfrastructure
{
    public class DomainEventRegistrationRemover : IDisposable 
    {
        private readonly Action CallOnDispose;
 
        public DomainEventRegistrationRemover(Action ToCall) 
        {
            this.CallOnDispose = ToCall; 
        }

        public void Dispose() 
        {
            this.CallOnDispose.DynamicInvoke();
        }
    }
}
