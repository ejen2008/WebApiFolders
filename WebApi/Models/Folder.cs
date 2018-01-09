using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class Folder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }

        public Folder() { }
        public Folder(string name)
        {
            Name = name;
        }
    }
}