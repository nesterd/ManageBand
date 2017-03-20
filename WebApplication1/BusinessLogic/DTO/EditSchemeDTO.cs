using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BusinessLogic.DTO
{
    public class EditSchemeDTO
    {
        public int id{ get; set; }
        public string name { get; set; }
        public HttpPostedFileBase file { get; set; }
    }
}
