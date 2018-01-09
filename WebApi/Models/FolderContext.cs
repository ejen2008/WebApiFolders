using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class FolderContext :DbContext
    {
        static FolderContext()
        {
            Database.SetInitializer<FolderContext>(new FolderContextInitializer());
        }
        public DbSet<Folder> Folders { get; set; }
    }
}