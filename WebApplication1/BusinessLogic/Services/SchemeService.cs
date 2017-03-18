﻿using BusinessLogic.DTO;
using BusinessLogic.Services.Base;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using BusinessLogic.Context;
using System.Data.Entity;

namespace BusinessLogic.Services
{
    public class SchemeService
        : ISchemeService
    {
        PartsCatalogueDbContext _context;

        public SchemeService()
        {
            _context = new PartsCatalogueDbContext();
        }

        string GetJSONString(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public string GetSchemeListInJSON()
        {
            return GetJSONString(GetSchemeList());
        }

        IEnumerable<Scheme> GetDbSchemeList()
        {
            return _context.Schemes.ToArray();
        }

        SchemeDTO SchemeDTOConstructor(Scheme scheme, IEnumerable<Scheme> baseSchemeList)
        {
            return new DTO.SchemeDTO
                (
                scheme, 
                baseSchemeList
                .Where(item => item.ParentId == scheme.Id)
                .Select(x => SchemeDTOConstructor(x, baseSchemeList))
                );
        }

        public IEnumerable<SchemeDTO> GetSchemeList()
        {
            //var list = _schemeRepo.GetSchemeList();
            var baseSchemeList = GetDbSchemeList();
            var list2 = baseSchemeList
                .Where(x => x.ParentId == null)
                .Select(item => SchemeDTOConstructor(item, baseSchemeList));
            //var list = _context.Schemes.ToArray();
            //var list2 = list.Where(x => x.ParentId == null).Select(item => new SchemeDTO(item));

            return list2;
        }

        public string GetSchemePartListInJSON()
        {
            return GetJSONString(GetSchemePartList());
        }

        public IEnumerable<SchemePartsDTO> GetSchemePartList()
        {
            var schemePartList = _context.SchemeParts.ToArray();
            var schemeIdList = schemePartList.Select(x => x.SchemeId).Distinct().ToArray();
            var details = _context.Details.ToArray();

            return schemeIdList
                .Select(x => new SchemePartsDTO
                                 (
                                     x, 
                                     schemePartList
                                         .Where(schemePartPair => schemePartPair.SchemeId == x)
                                         .Select(schemePartPair => 
                                              new Part
                                              {
                                                  count = schemePartPair.Count,
                                                  name = details
                                                     .FirstOrDefault(detail => detail.Id == schemePartPair.PartId)
                                                     .Name,
                                                  article = details
                                                     .FirstOrDefault(detail => detail.Id == schemePartPair.PartId)
                                                     .Article,
                                                  detailId = schemePartPair.PartId,
                                                  schemePartId = schemePartPair.Id
                                              })
                                         .ToArray()
                                 ));

        }

        public SchemePartsDTO GetPartsBySchemeId(int schemeId)
        {
            return GetSchemePartList().FirstOrDefault(x => x.schemeId == schemeId);
        }

        public void EditPartCount(int schemePartId, int newCount)
        {
            //_schemeRepo.EditPartCount(schemePartId, newCount);
            var schemePart = _context.SchemeParts.Find(schemePartId);
            if (schemePart == null)
                return;
            schemePart.Count = newCount;
            _context.Entry(schemePart).State = System.Data.Entity.EntityState.Modified;
            _context.SaveChanges();

        }

        public void DeletePart(int schemePartId)
        {
            //_schemeRepo.DeletePart(schemePartId);
            var schemePart = _context.SchemeParts.Find(schemePartId);
            if (schemePart == null)
                return;
            _context.SchemeParts.Remove(schemePart);
            _context.SaveChanges();
        }

        public IEnumerable<SelectOptionDTO> GetArticles(string partOfArticle)
        {
            var filteredDetails = _context.Details
                              .Where(x => x.Article.Contains(partOfArticle)).ToArray();
            return filteredDetails.Select(y => new SelectOptionDTO { value = y.Article, label = $"Артикул: \"{y.Article}\" Название: \"{y.Name}\"" }).ToArray();
        }

        public void AddSchemePart(AddSchemePartDTO addSchemePart)
        {
            var article = addSchemePart.article;
            if (!CheckDetail(article))
            {
                AddDetail(new Domain.Entities.Detail { Article = article, Name = addSchemePart.name });
            }

            AddSchemePart(new Domain.Entities.SchemePart
            {
                SchemeId = addSchemePart.schemeId,
                PartId = GetDetailIdByArticle(article),
                Count = addSchemePart.count
            });
        }

        int GetDetailIdByArticle(string article)
        {
            return _context.Details.FirstOrDefault(detail => detail.Article == article).Id;
        }

        void AddDetail(Detail detail)
        {
            _context.Details.Add(detail);
            _context.SaveChanges();
        }

        void AddSchemePart(SchemePart schemePart)
        {
            _context.SchemeParts.Add(schemePart);
            _context.SaveChanges();
        }

        bool CheckDetail(string article)
        {
            return _context.Details.Any(detail => detail.Article == article);
        }

        public void AddScheme(Scheme scheme)
        {
            _context.Schemes.Add(scheme);
            _context.SaveChanges();
        }

        public SchemeDTO GetLastScheme()
        {
            var schemeList = GetDbSchemeList();
            return SchemeDTOConstructor(schemeList.LastOrDefault(), schemeList);
        }

        public void DeleteScheme(int id)
        {
            var schemeTable = _context.Schemes;
            List<Scheme> listToRemove = new List<Scheme>();
            AddSchemesToListToRemove(id, listToRemove, schemeTable);
            //var scheme = _context.Schemes.Find(id);
            //if(scheme != null)
            //{
            //    _context.Schemes.Remove(scheme);
            //    _context.SaveChanges();
            //}

            schemeTable.RemoveRange(listToRemove);
            _context.SaveChanges();
        }

        void AddSchemesToListToRemove(int id, List<Scheme> listToRemove, DbSet<Scheme> tableInDb)
        {
            var schemeToRemove = tableInDb.Find(id);
            listToRemove.Add(schemeToRemove);
            var childsToRemove = schemeToRemove.Childs;
            if (childsToRemove.Count > 0)
            {
                foreach (var child in childsToRemove)
                    AddSchemesToListToRemove(child.Id, listToRemove, tableInDb);
            }
        }

        Scheme GetDbSchemeById(int id)
        {
            return _context.Schemes.Find(id);
        }

        public SchemeDTO GetSchemeById(int id)
        {

            return SchemeDTOConstructor(GetDbSchemeById(id), GetDbSchemeList());
        }
    }
}
