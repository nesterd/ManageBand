using DataAccess.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using DataAccess.Context;

namespace DataAccess.Repositories
{
    public class SchemeRepository
        : ISchemeRepository
    {
        PartsCatalogueDbContext _context;

        public SchemeRepository()
        {
            _context = new PartsCatalogueDbContext();
        }

        public IEnumerable<Detail> GetDetailList()
        {
            return _context.Details.ToArray();
        }

        public IEnumerable<Scheme> GetSchemeList()
        {
            return _context.Schemes.ToArray();
        }

        public IEnumerable<SchemePart> GetSchemePartList()
        {
            return _context.SchemeParts.ToArray();
        }

        public void EditPartCount(int schemePartId, int newCount)
        {
            var schemePart = _context.SchemeParts.Find(schemePartId);
            if (schemePart == null)
                return;
            schemePart.Count = newCount;
            _context.Entry(schemePart).State = System.Data.Entity.EntityState.Modified;
            _context.SaveChanges();

        }

        public void DeletePart(int id)
        {
            var schemePart = _context.SchemeParts.Find(id);
            if (schemePart == null)
                return;
            _context.SchemeParts.Remove(schemePart);
            _context.SaveChanges();
        }

        public IEnumerable<Detail> GetDetails()
        {
            return _context.Details.ToArray();
        }

        public bool CheckDetail(string article)
        {
            return _context.Details.Any(detail => detail.Article == article);
        }

        public void AddDetail(Detail detail)
        {
            _context.Details.Add(detail);
            _context.SaveChanges();
        }

        public void AddSchemePart(SchemePart schemePart)
        {
            _context.SchemeParts.Add(schemePart);
            _context.SaveChanges();
        }

        public int GetDetailIdByArticle(string article)
        {
            return _context.Details.FirstOrDefault(detail => detail.Article == article).Id;
        }

        public void AddScheme(Scheme scheme)
        {
            
            _context.Schemes.Add(scheme);
            _context.SaveChanges();
        }

        public Scheme GetLastScheme()
        {
            return _context.Schemes.ToList().LastOrDefault();
        }

        public void DeleteScheme(int id)
        {
            
            var scheme = _context.Schemes.Find(id);
            if(scheme != null)
            {
                _context.Schemes.Remove(scheme);
                _context.SaveChanges();
            }
        }

        public Scheme GetSchemeById(int id)
        {
            return _context.Schemes.Find(id);
        }
    }
}
