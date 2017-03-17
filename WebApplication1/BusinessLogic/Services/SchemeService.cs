﻿using BusinessLogic.DTO;
using BusinessLogic.Services.Base;
using DataAccess.Repositories;
using DataAccess.Repositories.Base;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace BusinessLogic.Services
{
    public class SchemeService
        : ISchemeService
    {
        ISchemeRepository _schemeRepo;

        public SchemeService()
        {
            _schemeRepo = new SchemeRepository();
        }

        string GetJSONString(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public string GetSchemeListInJSON()
        {
            return GetJSONString(GetSchemeList());
        }

        public IEnumerable<SchemeDTO> GetSchemeList()
        {
            var list = _schemeRepo.GetSchemeList();
            var list2 = list.Where(x => x.ParentId == null).Select(item => new SchemeDTO(item));

            return list2;
        }

        public string GetSchemePartListInJSON()
        {
            return GetJSONString(GetSchemePartList());
        }

        public IEnumerable<SchemePartsDTO> GetSchemePartList()
        {
            var schemePartList = _schemeRepo.GetSchemePartList();
            var schemeIdList = schemePartList.Select(x => x.SchemeId).Distinct().ToArray();

            return schemeIdList.Select(x => new SchemePartsDTO(x, schemePartList));

        }

        public SchemePartsDTO GetPartsBySchemeId(int schemeId)
        {
            return GetSchemePartList().FirstOrDefault(x => x.schemeId == schemeId);
        }

        public void EditPartCount(int schemePartId, int newCount)
        {
            _schemeRepo.EditPartCount(schemePartId, newCount);
        }

        public void DeletePart(int schemePartId)
        {
            _schemeRepo.DeletePart(schemePartId);
        }

        public IEnumerable<SelectOptionDTO> GetArticles(string partOfArticle)
        {
            return _schemeRepo.GetDetails()
                              .Where(x => x.Article.Contains(partOfArticle))
                              .Select(y => new SelectOptionDTO { value = y.Article, label = $"Артикул: \"{y.Article}\" Название: \"{y.Name}\"" });
        }

        public void AddSchemePart(AddSchemePartDTO addSchemePart)
        {
            var article = addSchemePart.article;
            if (!_schemeRepo.CheckDetail(article))
            {
                _schemeRepo.AddDetail(new Domain.Entities.Detail { Article = article, Name = addSchemePart.name });
            }

            _schemeRepo.AddSchemePart(new Domain.Entities.SchemePart
            {
                SchemeId = addSchemePart.schemeId,
                PartId = _schemeRepo.GetDetailIdByArticle(article),
                Count = addSchemePart.count
            });
        }

        public void AddScheme(Scheme scheme)
        {
            _schemeRepo.AddScheme(scheme);
        }

        public SchemeDTO GetLastScheme()
        {
            return new SchemeDTO(_schemeRepo.GetLastScheme());
        }

        public void DeleteScheme(int id)
        {
            _schemeRepo.DeleteScheme(id);
        }

        public SchemeDTO GetSchemeById(int id)
        {
            return new SchemeDTO(_schemeRepo.GetSchemeById(id));
        }
    }
}
