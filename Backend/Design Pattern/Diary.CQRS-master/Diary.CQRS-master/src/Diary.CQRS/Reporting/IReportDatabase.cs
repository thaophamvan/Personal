using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Reporting
{
    public interface IReportDatabase
    {
        DiaryItemDto GetById(Guid id);
        void Add(DiaryItemDto item);
        void Delete(Guid id);
        List<DiaryItemDto> GetItems();
    }
}
