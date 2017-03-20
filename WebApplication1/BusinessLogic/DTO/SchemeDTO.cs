﻿using Domain.Entities;
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
        public int? parentId { get; set; }
        public IEnumerable<SchemeDTO> childs { get; set; }

        public SchemeDTO(Scheme scheme, IEnumerable<SchemeDTO> childs)
        {
            id = scheme.Id;
            name = scheme.Name;
            image = scheme.Image;
            parentId = scheme.ParentId;
            this.childs = childs;
            isExpand = false;
        }
    }
}
