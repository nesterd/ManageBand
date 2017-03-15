using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.DTO
{
    public class Part
    {
        public string name { get; set; }

        public string article { get; set; }

        public int count { get; set; }

        public int detailId { get; set; }

        public int schemePartId { get; set; }
    }
}
