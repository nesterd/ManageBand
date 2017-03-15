using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Context
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

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<SchemePart>()
        //        .HasRequired(schem => schem.Part)
        //        .WithMany(detail => detail.SchemeParts)
        //        .HasForeignKey(schem => schem.SchemeId)
        //        .WillCascadeOnDelete(false);



        //    base.OnModelCreating(modelBuilder);
        //}
    }
}
