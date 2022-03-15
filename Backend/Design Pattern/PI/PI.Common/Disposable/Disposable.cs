using System;

namespace PI.Common.Disposable
{
    public class Disposable:IDisposable
    {
        private bool _isDispose;
        ~Disposable()
        {
            Dispose(false);
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (_isDispose && disposing)
            {
                DisposeCore();    
            }
            _isDispose = true;
        }
        protected virtual void DisposeCore()
        {

        }
    }
}
