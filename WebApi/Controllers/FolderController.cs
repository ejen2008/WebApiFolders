using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class FolderController : ApiController
    {
        private FolderContext dbFolders = new FolderContext();
        private const int pageSize = 10;

        public IEnumerable<Folder> GetFolders(int page = 1)
        {
            List<Folder> list = dbFolders.Folders.Where<Folder>(f => f.ParentId == 0).ToList();
            IEnumerable<Folder> listResponse = list.Skip((page - 1) * pageSize).Take(pageSize);
            return list;

        }
        [Route("api/folder/subfolder/{id}")]
        public IEnumerable<Folder> GetSubfolder(int id)
        {
            var subFolderList = dbFolders.Folders.Where<Folder>(f => f.ParentId == id);
            return subFolderList;

        }

        public IHttpActionResult Post(Folder folder)
        {
            //folder.ParentId = 0;
            IHttpActionResult result;
            if (folder != null && folder.Name != null)
            {
                dbFolders.Entry(folder).State = EntityState.Modified;
                dbFolders.SaveChanges();
                result = Ok(200);
            }
            else {
                result = NotFound();
            }
            return result;
        }

        public IEnumerable<Folder> Put(Folder newFolder)
        {
            List<Folder> result = null;
            if (newFolder != null && newFolder.Name != null)
            {
                dbFolders.Folders.Add(newFolder);
                dbFolders.SaveChanges();
                result.Add(dbFolders.Folders.Last());
            }
            return result;
        }


        //public void Delete(int id)
        //{
        //    Folder deleteFolder = dbFolders.Folders.Find(id);

        //    if (deleteFolder != null)
        //    {
        //        IEnumerable<Folder> subfolder = dbFolders.Folders.Where(f => f.ParentId == id);
        //        dbFolders.Folders.Remove(deleteFolder);
        //        dbFolders.Folders.RemoveRange(subfolder);
        //        dbFolders.SaveChanges();
        //    }
        //}

        public IHttpActionResult Delete(int id)
        {
            Folder deleteFolder = dbFolders.Folders.Find(id);
            IHttpActionResult result;
            if (deleteFolder != null)
            {
                IEnumerable<Folder> subfolder = dbFolders.Folders.Where(f => f.ParentId == id);
                dbFolders.Folders.Remove(deleteFolder);
                dbFolders.Folders.RemoveRange(subfolder);
                dbFolders.SaveChanges();
                result = Ok(200);
            }
            else
            {
                result = NotFound();
            }
            return result;
        }
    }
}
