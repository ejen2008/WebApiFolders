using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class FolderContextInitializer: DropCreateDatabaseAlways/*CreateDatabaseIfNotExists*/<FolderContext>
    {
        protected override void Seed(FolderContext context)
        {
            Folder mainFolder = new Folder { Id = 1, Name = "MainFolder" };
            Folder programFolder = new Folder {Id=2, Name = "Program", ParentId = mainFolder.Id };
            context.Folders.Add(mainFolder);
            context.Folders.Add(new Folder { Id=3, Name = "Vidoe", ParentId = mainFolder.Id });
            context.Folders.Add(new Folder { Id=4, Name = "Music", ParentId = mainFolder.Id });
            context.Folders.Add(programFolder);
            context.Folders.Add(new Folder { Id = 5, Name = "Documents", ParentId = mainFolder.Id });
            context.Folders.Add(new Folder { Id = 6, Name = "newFolder", ParentId = mainFolder.Id });
            context.Folders.Add(new Folder { Id = 7, Name = "newFolder", ParentId = programFolder.Id });
            context.SaveChanges();
        }
    }
}