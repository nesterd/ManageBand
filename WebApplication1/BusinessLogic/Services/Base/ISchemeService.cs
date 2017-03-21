using BusinessLogic.DTO;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BusinessLogic.Services.Base
{
    public interface ISchemeService
    {
        string GetSchemeListInJSON(int catalogueId);
        IEnumerable<SchemeDTO> GetSchemeList(int catalogueId);
        SchemeDTO GetLastScheme();
        string GetSchemePartListInJSON(int catalogueId);
        IEnumerable<SchemePartsDTO> GetSchemePartList(int catalogueId);
        SchemePartsDTO GetPartsBySchemeId(int schemeId);
        void EditPartCount(int schemePartId, int newCount);
        void DeletePart(int schemePartId);
        IEnumerable<SelectOptionDTO> GetArticles(string partOfArticle);
        void AddSchemePart(AddSchemePartDTO addSchemePart);
        string AddScheme(Scheme scheme);
        void DeleteScheme(int id);
        SchemeDTO GetSchemeById(int id);
        string EditScheme(Scheme editedScheme, bool isNewImage);


        IEnumerable<Catalogue> GetCatalogueList();
        Catalogue GetCatalogueById(int id);
        void AddCatalogue(Catalogue catalogue);
        void EditCatalogue(Catalogue catalogue);
        void DeleteCatalogue(int id);


    }
}
