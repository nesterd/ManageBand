using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class SchemePart
        : BaseDbEntity
    {
        public int SchemeId { get; set; }

        public int PartId { get; set; }

        public int Count { get; set; }

        [ForeignKey("SchemeId")]
        public virtual Scheme Scheme { get; set; }

        [ForeignKey("PartId")]
        public virtual Detail Part { get; set; }
    }
}
