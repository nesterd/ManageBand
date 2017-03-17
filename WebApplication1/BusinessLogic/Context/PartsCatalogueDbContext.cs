using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Context
{
    public class PartsCatalogueDbContext
        : DbContext
    {
        public PartsCatalogueDbContext()
            : base("localConnection")
        {

        }

        public virtual DbSet<Scheme> Schemes { get; set; }
        public virtual DbSet<Detail> Details { get; set; }
        public virtual DbSet<SchemePart> SchemeParts { get; set; }
        
    }
}
