using DataAccess.Context;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Initializers
{
    public class DbContextInitializer
        : DropCreateDatabaseAlways<PartsCatalogueDbContext>
    {
        protected override void Seed(PartsCatalogueDbContext context)
        {
            var detailList = new List<Detail>();
            for(int i = 0; i < 15; i++)
            {
                detailList.Add(new Detail { Name = "detail" + (i + 1), Article = "article" + (i + 1) });
            }

            context.Details.AddRange(detailList);
            context.SaveChanges();

            context.Schemes.Add(new Scheme { Name = "rootScheme", Image = $"/images/catRoot.png" });
            context.SaveChanges();

            context.Schemes.AddRange(new List<Scheme>
            {
                new Scheme { ParentId = 1, Name = "scheme_1", Image =  $"/images/scheme_1.png" },
                new Scheme { ParentId = 1, Name = "scheme_2", Image =  $"/images/scheme_2.png"  },
                new Scheme { ParentId = 1, Name = "scheme_3", Image =  $"/images/scheme_3.png"  },
                new Scheme { ParentId = 2, Name = "scheme_4", Image =  $"/images/scheme_4.png"  },
                new Scheme { ParentId = 2, Name = "scheme_5", Image =  $"/images/scheme_5.png"  },
                new Scheme { ParentId = 2, Name = "scheme_6", Image =  $"/images/scheme_6.png"  },
                new Scheme { ParentId = 3, Name = "scheme_7", Image =  $"/images/scheme_7.png"  },
                new Scheme { ParentId = 3, Name = "scheme_8", Image =  $"/images/scheme_8.png"  },
                new Scheme { ParentId = 4, Name = "scheme_9", Image =  $"/images/scheme_9.png"  },
                new Scheme { ParentId = 4, Name = "scheme_10", Image =  $"/images/scheme_10.png"  },
                new Scheme { ParentId = 4, Name = "scheme_11", Image =  $"/images/scheme_11.png"  }
            });
            context.SaveChanges();

            context.SchemeParts.AddRange(new List<SchemePart>
            {
                new SchemePart { SchemeId = 1, PartId = 2, Count = 1 },
                new SchemePart { SchemeId = 1, PartId = 3, Count = 1 },
                new SchemePart { SchemeId = 2, PartId = 4, Count = 1 },
                new SchemePart { SchemeId = 2, PartId = 5, Count = 1 },
                new SchemePart { SchemeId = 2, PartId = 6, Count = 1 },
                new SchemePart { SchemeId = 3, PartId = 7, Count = 3 },
                new SchemePart { SchemeId = 3, PartId = 8, Count = 5 },
                new SchemePart { SchemeId = 3, PartId = 9, Count = 1 },
                new SchemePart { SchemeId = 4, PartId = 10, Count = 3 },
                new SchemePart { SchemeId = 4, PartId = 11, Count = 2 },
                new SchemePart { SchemeId = 6, PartId = 10, Count = 4 },
                new SchemePart { SchemeId = 6, PartId = 12, Count = 3 },
                new SchemePart { SchemeId = 9, PartId = 13, Count = 5 },
                new SchemePart { SchemeId = 9, PartId = 14, Count = 7 },
                new SchemePart { SchemeId = 9, PartId = 15, Count = 5 }
            });
            context.SaveChanges();




        }
    }
}
