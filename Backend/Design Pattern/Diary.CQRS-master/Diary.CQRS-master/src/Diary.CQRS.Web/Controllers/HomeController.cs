using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Diary.CQRS.Commands;
using Diary.CQRS.Configuration;
using Diary.CQRS.Reporting;

namespace Diary.CQRS.Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            ViewBag.Model = ServiceLocator.ReportDatabase.GetItems();
            return View();
        }


        public ActionResult Edit(Guid id)
        {
            var item = ServiceLocator.ReportDatabase.GetById(id);
            var model = new DiaryItemDto()
            {
                Description = item.Description,
                From = item.From,
                Id = item.Id,
                Title = item.Title,
                To = item.To,
                Version = item.Version
            };
            return View(model);
        }

        [HttpPost]
        public ActionResult Edit(DiaryItemDto item)
        {
            ServiceLocator.CommandBus.Send(new ChangeItemCommand(item.Id, item.Title, item.Description, item.From, item.To, item.Version));

            return RedirectToAction("Index");
        }

        public ActionResult Delete(Guid id)
        {
            var item = ServiceLocator.ReportDatabase.GetById(id);
            ServiceLocator.CommandBus.Send(new DeleteItemCommand(item.Id, item.Version));
            return RedirectToAction("Index");
        }


        public ActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Add(DiaryItemDto item)
        {
            ServiceLocator.CommandBus.Send(new CreateItemCommand(Guid.NewGuid(), item.Title, item.Description, -1, item.From, item.To));

            return RedirectToAction("Index");

        }



    }
}
