using BusinessLogic.DTO;
using BusinessLogic.Services;
using BusinessLogic.Services.Base;
using BusinessLogic.Context;
using Domain.Entities;
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
        
        [HttpGet]
        public ActionResult DeleteCatalogue(int id)
        {
            _schemeService.DeleteCatalogue(id);
            return RedirectToAction("CatalogueList");
        }
        [HttpGet]
        public ActionResult AddCatalogue()
        {
            ViewBag.IsAdding = true;
            return View("EditCatalogue");
        }

        [HttpPost]
        public ActionResult AddCatalogue(CatalogueViewModel catalogue)
        {
            _schemeService.AddCatalogue(new Catalogue { Name = catalogue.Name });
            return RedirectToAction("CatalogueList");
        }

        [HttpGet]
        public ActionResult EditCatalogue(int id)
        {
            var catalogue = _schemeService.GetCatalogueById(id);
            ViewBag.IsAdding = false;
            return View(new CatalogueViewModel { Id = catalogue.Id, Name = catalogue.Name});
        }

        [HttpPost]
        public ActionResult EditCatalogue(CatalogueViewModel catalogue)
        {
            _schemeService.EditCatalogue(new Catalogue { Name = catalogue.Name, Id = catalogue.Id });
            return RedirectToAction("CatalogueList");
        }

        public ActionResult CatalogueList()
        {
            return View(_schemeService.GetCatalogueList());
        }
       
        public ActionResult Catalogue(int id)
        {

            ViewBag.SchemeListInJSON = _schemeService.GetSchemeListInJSON(id);
            ViewBag.SchemePartsListInJSON = _schemeService.GetSchemePartListInJSON(id);
            ViewBag.CatalogueId = id;
            return View();
        }

        public ActionResult AddSchemePart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<AddSchemePartDTO>(jsonString);

            _schemeService.AddSchemePart(model);

            return Json(_schemeService.GetPartsBySchemeId(model.schemeId));
        }

        [HttpPost]
        public ActionResult EditPart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<EditPartCountModel>(jsonString);
            _schemeService.EditPartCount(model.schemePartId, model.newCount);

            return Json(_schemeService.GetPartsBySchemeId(model.schemeId));
            //return Json(_schemeService.GetSchemePartList());
        }

        [HttpPost]
        public ActionResult DeletePart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<EditPartCountModel>(jsonString);
            _schemeService.DeletePart(model.schemePartId);

            //return Json(_schemeService.GetSchemePartList());
            return Json(_schemeService.GetPartsBySchemeId(model.schemeId));
        }

        [HttpPost]
        public ActionResult GetArticles()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<string>(jsonString);

            return Json(_schemeService.GetArticles(model));
        }

        void ImageLoader(string fileName, HttpRequestBase request)
        {
            
            var image = request.Files["image"];
            if (image != null)
            {
                image.SaveAs(Server.MapPath("~" + fileName));
            }
        }

        [HttpPost]
        public ActionResult AddScheme()
        {
            var parentSchemeId = Request["parentSchemeId"];
            int? parentId;

            if (parentSchemeId == "null")
                parentId = null;

            else
                parentId = int.Parse(parentSchemeId);

            var fileName = _schemeService.AddScheme(new Scheme { Name = Request["name"], ParentId = parentId, CatalogueId = int.Parse(Request["catalogueId"]) });

            ImageLoader(fileName, Request);

            return Json(_schemeService.GetLastScheme());
        }

        [HttpPost]
        public ActionResult EditScheme()
        {
            var id = int.Parse(Request["id"]);
            var isNewImage = Request.Files["image"] != null;
            var fileName = _schemeService.EditScheme(new Scheme { Id = id, Name = Request["name"] }, isNewImage);

            ImageLoader(fileName, Request);

            return Json(_schemeService.GetSchemeById(id));
        }

        [HttpPost]
        public ActionResult DeleteScheme()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<int>(jsonString);
            var schemeToDelete = _schemeService.GetSchemeById(model);
            _schemeService.DeleteScheme(model);

            return Json(schemeToDelete);
        }

    }
}