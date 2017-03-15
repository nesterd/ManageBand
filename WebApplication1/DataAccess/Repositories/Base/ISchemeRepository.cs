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
        IEnumerable<Detail> GetDetailList();
        IEnumerable<SchemePart> GetSchemePartList();

        void EditPartCount(int schemePartId, int newCount);
        void DeletePart(int id);

        IEnumerable<Detail> GetDetails();

    }
}
