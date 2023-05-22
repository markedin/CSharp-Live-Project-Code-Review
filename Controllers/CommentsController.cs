using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TheatreCMS3.Areas.Blog.Models;
using TheatreCMS3.Models;

namespace TheatreCMS3.Areas.Blog.Controllers
{
    public class CommentsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Blog/Comments
        public ActionResult Index()
        {
            var commentsSorted = from c in db.Comments
                                 orderby c.CommentDate descending
                                 select c;
            return View(commentsSorted);
        }

        // GET: Blog/Comments/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Comment comment = db.Comments.Find(id);
            if (comment == null)
            {
                return HttpNotFound();
            }
            return View(comment);
        }

        // GET: Blog/Comments/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Blog/Comments/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "CommentId,Message,CommentDate,Likes,Dislikes")] Comment comment)
        {
            if (ModelState.IsValid)
            {
                db.Comments.Add(comment);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(comment);
        }

        // GET: Blog/Comments/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Comment comment = db.Comments.Find(id);
            if (comment == null)
            {
                return HttpNotFound();
            }
            return View(comment);
        }

        // POST: Blog/Comments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CommentId,Message,CommentDate,Likes,Dislikes")] Comment comment)
        {
            if (ModelState.IsValid)
            {
                db.Entry(comment).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(comment);
        }

        // GET: Blog/Comments/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Comment comment = db.Comments.Find(id);
            if (comment == null)
            {
                return HttpNotFound();
            }
            return View(comment);
        }

        // POST: Blog/Comments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Comment comment = db.Comments.Find(id);
            db.Comments.Remove(comment);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpPost]
        public JsonResult addLike(int id)
        {   
            Comment comment = db.Comments.Find(id);
            comment.Likes += 1;
            db.SaveChanges();
            var response = new JsonResult();
            response.Data = new List<double>()
            {
                comment.Likes,
                comment.LikeRatio()
            };
            return Json(response, JsonRequestBehavior.AllowGet);
            
        }

        [HttpPost]
        public JsonResult addDislike(int id)
        {
            Comment comment = db.Comments.Find(id);
            comment.Dislikes += 1;
            db.SaveChanges();
            var response = new JsonResult();
            response.Data = new List<double>()
            {
                comment.Dislikes,
                comment.LikeRatio()
            };
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult deleteComment(int id)
        {
            Comment comment = db.Comments.Find(id);
            db.Comments.Remove(comment);
            db.SaveChanges();
            return Json("The comment was deleted successfully", JsonRequestBehavior.AllowGet); 

        }

        [HttpPost]
        public JsonResult addComment(string message)
        {
            Comment comment = new Comment();
            comment.Message = message;
            db.Comments.Add(comment);
            db.SaveChanges();
            var response= new JsonResult();
            response.Data = new List<string>() { comment.CommentId.ToString(), comment.Message, comment.CommentDate.ToString() }; 
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult addReply(Comment parent)
        {
            Comment comment = new Comment();
            comment.Parent = parent;
            parent.Replies.Add(comment);
            db.SaveChanges();
            var response = new JsonResult();
            response.Data = new List<string>() { comment.CommentId.ToString(), comment.Message}

        }


    }
}
