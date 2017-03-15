using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Scheme
        : Base.BaseDbEntity
    {
        public string Name { get; set; }

        public string Image { get; set; }

        public int? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual Scheme Parent { get; set; }

        public virtual ICollection<Scheme> Childs { get; set;}

        public virtual ICollection<Detail> Patrts { get; set; }

        public virtual ICollection<SchemePart> SchemeParts { get; set; }
    }
}
