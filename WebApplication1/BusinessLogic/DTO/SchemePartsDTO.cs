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

        public SchemePartsDTO(int schemeId, IEnumerable<Part> parts)
        {
            this.schemeId = schemeId;
            this.parts = parts;
        }

    }
}
