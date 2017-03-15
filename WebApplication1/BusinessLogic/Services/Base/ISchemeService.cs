using BusinessLogic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Services.Base
{
    public interface ISchemeService
    {
        string GetSchemeListInJSON();
        IEnumerable<SchemeDTO> GetSchemeList();
        string GetSchemePartListInJSON();
        IEnumerable<SchemePartsDTO> GetSchemePartList();
        SchemePartsDTO GetPartsBySchemeId(int schemeId);
        void EditPartCount(int schemePartId, int newCount);
        void DeletePart(int schemePartId);
        IEnumerable<SelectOptionDTO> GetArticles(string partOfArticle);
    }
}
