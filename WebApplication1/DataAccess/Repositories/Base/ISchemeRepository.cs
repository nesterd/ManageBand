using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Base
{
    public interface ISchemeRepository
    {
        IEnumerable<Scheme> GetSchemeList();
        Scheme GetLastScheme();
        IEnumerable<Detail> GetDetailList();
        IEnumerable<SchemePart> GetSchemePartList();

        void EditPartCount(int schemePartId, int newCount);
        void DeletePart(int id);
        void AddDetail(Detail detail);
        void AddSchemePart(SchemePart schemePart);

        IEnumerable<Detail> GetDetails();

        bool CheckDetail(string article);

        int GetDetailIdByArticle(string article);
        void AddScheme(Scheme scheme);
        void DeleteScheme(int id);
        Scheme GetSchemeById(int id);

    }
}
