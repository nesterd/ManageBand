using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTO
{
    public class SchemeDTO
    {
        public int id { get; set; }
        public string name { get; set; }
        public string image { get; set; }
        public bool isExpand { get; set; }
        public IEnumerable<SchemeDTO> childs { get; set; }

        public SchemeDTO(Scheme scheme)
        {
            id = scheme.Id;
            name = scheme.Name;
            image = scheme.Image;
            if (scheme.Childs.Count > 0)
                childs = scheme.Childs.Select(child => new SchemeDTO(child)).ToList();
            else
                childs = new List<SchemeDTO>();

            isExpand = false;
        }
    }
}
