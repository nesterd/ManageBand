using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Detail 
        : BaseDbEntity
    {
        public string Name { get; set; }
        
        public string Article { get; set; }

        public virtual ICollection<Scheme> Schemes { get; set; }
        
        public virtual ICollection<SchemePart> SchemeParts { get; set; }
    }
}
