using BusinessLogic.Services;
using BusinessLogic.Services.Base;
using DataAccess.Context;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models.Default;

namespace WebApplication1.Controllers
{
    public class DefaultController : Controller
    {
        ISchemeService _schemeService;

        public DefaultController()
        {
            _schemeService = new SchemeService();
        }
       
        public ActionResult Index()
        {

            ViewBag.SchemeListInJSON = _schemeService.GetSchemeListInJSON();
            ViewBag.SchemePartsListInJSON = _schemeService.GetSchemePartListInJSON();

            return View();
        }

        public ActionResult Get()
        {
            return Json(_schemeService.GetSchemeList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditPart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<EditPartCountModel>(jsonString);
            _schemeService.EditPartCount(model.schemePartId, model.newCount);

            //return Json(_schemeService.GetPartsBySchemeId(model.schemeId));
            return Json(_schemeService.GetSchemePartList());
        }

        [HttpPost]
        public ActionResult DeletePart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<EditPartCountModel>(jsonString);
            _schemeService.DeletePart(model.schemePartId);
            //return Json(_schemeService.GetPartsBySchemeId(model.schemeId));
            return Json(_schemeService.GetSchemePartList());
        }

        [HttpPost]
        public ActionResult GetArticles()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<Str>(jsonString);

            return Json(_schemeService.GetArticles(model.str));
        }

        class Str
        {
            public string str { get; set; }
        }

    }
}