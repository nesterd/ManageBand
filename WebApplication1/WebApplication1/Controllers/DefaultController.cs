﻿using BusinessLogic.DTO;
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
       
        public ActionResult Index()
        {

            ViewBag.SchemeListInJSON = _schemeService.GetSchemeListInJSON();
            ViewBag.SchemePartsListInJSON = _schemeService.GetSchemePartListInJSON();

            return View();
        }

        public ActionResult AddSchemePart()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<AddSchemePartDTO>(jsonString);

            _schemeService.AddSchemePart(model);

            return Json(_schemeService.GetSchemePartList());
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
            var model = JsonConvert.DeserializeObject<string>(jsonString);

            return Json(_schemeService.GetArticles(model));
        }

        [HttpPost]
        public ActionResult AddScheme()
        {
            var jsonString = new StreamReader(Request.InputStream).ReadToEnd();
            var model = JsonConvert.DeserializeObject<Scheme>(jsonString);
            _schemeService.AddScheme(model);

            return Json(_schemeService.GetLastScheme());
        }

        //[HttpPost]
        //public ActionResult EditScheme()
        //{

        //}

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