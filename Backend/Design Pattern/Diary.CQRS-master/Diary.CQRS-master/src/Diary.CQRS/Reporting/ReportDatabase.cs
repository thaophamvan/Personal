using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diary.CQRS.Reporting
{
    public class ReportDatabase:IReportDatabase
    {
        static readonly List<DiaryItemDto> items=new List<DiaryItemDto>(); 

        public DiaryItemDto GetById(Guid id)
        {
            return items.Where(a => a.Id == id).FirstOrDefault();
        }

        public void Add(DiaryItemDto item)
        {
            items.Add(item);
        }

        public void Delete(Guid id)
        {
            items.RemoveAll(i => i.Id == id);
        }

        public List<DiaryItemDto> GetItems()
        {
            return items;
        }
    }
}
