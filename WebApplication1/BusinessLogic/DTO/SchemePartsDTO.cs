using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTO
{
    public class SchemePartsDTO
    {
        public int schemeId { get; set; }
        public IEnumerable<Part> parts { get; set; }

        public SchemePartsDTO(int schemeId, IEnumerable<SchemePart> schemePartList)
        {
            this.schemeId = schemeId;

            parts = schemePartList
                .Where(schemePartPair => schemePartPair.SchemeId == schemeId)
                .Select(schemePartPair => 
                new Part { count = schemePartPair.Count,
                    name = schemePartPair.Part.Name,
                    article = schemePartPair.Part.Article,
                    detailId = schemePartPair.Part.Id,
                    schemePartId = schemePartPair.Id })
                .ToArray();

            
        }

    }
}
