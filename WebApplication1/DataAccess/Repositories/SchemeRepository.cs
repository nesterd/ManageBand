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
    }
}
