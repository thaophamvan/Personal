using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Diary.CQRS.Commands;
using Diary.CQRS.Domain;
using Diary.CQRS.Storage;

namespace Diary.CQRS.CommandHandlers
{
    public class CreateItemCommandHandler:ICommandHandler<CreateItemCommand>
    {
        private IRepository<DiaryItem> _repository;

        public CreateItemCommandHandler(IRepository<DiaryItem> repository )
        {
            _repository = repository;
        }

        public void Execute(CreateItemCommand command)
        {
            if (command==null)
            {
                throw new Exception();
            }
            if (_repository==null)
            {
                throw new Exception();
            }
            var aggregate = new DiaryItem(command.Id, command.Title, command.Description, command.From, command.To);
            aggregate.Version = -1;
            _repository.Save(aggregate, aggregate.Version);
        }
    }
}
