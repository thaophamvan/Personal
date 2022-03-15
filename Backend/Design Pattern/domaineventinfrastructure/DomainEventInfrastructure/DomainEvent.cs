using System;
using System.Collections.Generic;

namespace DomainEventInfrastructure
{
    public class DomainEvent<E> 
    {
        [ThreadStatic] 
        private static List<Action<E>> _actions; 

        protected List<Action<E>> actions 
        {
            get { 
                if (_actions == null) 
                    _actions = new List<Action<E>>(); 

                return _actions; 
            }
        }

        public IDisposable Register(Action<E> callback) 
        {
            actions.Add(callback);
            return new DomainEventRegistrationRemover(delegate
                {
                    actions.Remove(callback);
                }
            ); 
        }

        public void Raise(E args) 
        {
            foreach (Action<E> action in actions) 
                action.Invoke(args);
        }
    }
}

