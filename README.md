# Live Project

## Introduction
For the last two weeks of my time at the tech academy, I worked with my peers in a team developing a full scale MVC/MVVM Web Application in C#. Working on a legacy codebase was a great learning oppertunity for fixing bugs, cleaning up code, and adding requested features. There were some big changes that could have been a large time sink, but we used what we had to deliver what was needed on time. I saw how a good developer works with what they have to make a quality product. I worked on several [back end stories](#back-end-stories) that I am very proud of. Because much of the site had already been built, there were also a good deal of [front end stories](#front-end-stories) and UX improvements that needed to be completed, all of varying degrees of difficulty. Everyone on the team had a chance to work on front end and back end stories. Over the two week sprint I also had the opportunity to work on some other project management and team programming [skills](#other-skills-learned) that I'm confident I will use again and again on future projects.
  
Below are descriptions of the stories I worked on, along with code snippets and navigation links. I also have some full code files in this repo for the larger functionalities I implemented.

## Back End Stories
* [Comment Model](#comment-model)
* [Comment Controller](#comment-controller-httppost-methods)
* [Text Helper: Limit Words](#text-helper-limit-words)

### Comment Model
This model contains all the relevant information for a comment on the blog post section of the website. My task was to create the model while referencing a UML Class Diagram. This model was created using the ADO.NET Entity Data Model template. 
```c#
public class Comment
    {
        public int CommentId { get; set; }
        public ApplicationUser Author { get; set; }
        public string Message { get; set; }
        public DateTime CommentDate { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public virtual List<Comment> Replies { get; set; }
        public virtual Comment Parent { get; set; }

        public Comment(string message)
        {
            Message = message;
            CommentDate = DateTime.Now;
            Likes = 0;
            Dislikes = 0;
            
            
        }

        public Comment()
        {
            CommentDate = DateTime.Now;
        }

    }
```

This method recieves a DateTime argument and returns a formatted string describing how much time has passed. My task was to create the method and format the string to look similar to: "2 Days, 5 Hours, 24 Minutes, 6 Seconds ago". 
```c#
public static string CommentTimePassed(DateTime commentDate)
        {
            string returnString = "";
            List<string> returnStringList = new List<string>();
            returnStringList.Add((DateTime.Now - commentDate).Days.ToString() + " Days,");
            returnStringList.Add((DateTime.Now - commentDate).Hours.ToString() + " Hours,");
            returnStringList.Add((DateTime.Now - commentDate).Minutes.ToString() + " Minutes,");
            returnStringList.Add((DateTime.Now - commentDate).Seconds.ToString() + " Seconds ago");
            for (int i = 0; i < returnStringList.Count; i++)
            {
                if (returnStringList[0].Contains("0 "))
                {
                    returnStringList.RemoveAt(0);
                }
            }

            for (int i = 0; i < returnStringList.Count; i++)
            {
                returnString += returnStringList[i].ToString() + " ";
            }

            return returnString;
        }
```

This method returns a ratio of likes/dislikes, and is a parameter-less method. My task was to create a parameter-less method that returns a ratio. I used 'Double.IsNaN' to check if the ratio value was NaN, and in that case I would set the ratio to be 50. Without this, the return value would be NaN which caused errors in the view. 
```c#
public double LikeRatio()
        {
            double ratio = ((double) Likes) / ((double) Likes + (double) Dislikes) * 100;
            if (Double.IsNaN(ratio))
            {
                ratio = 50;
            }
            
            return ratio;
        }
```

### Comment Controller HttpPost Methods
Utilizing the Microsoft Entity Framework, I was able to create a controller with views. I did not add much code to the CRUD page functionality. I did create methods that could be called with AJAX to asynchronously update information on the page. My first task was to create the addLike and addDislike methods. 
```c#
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
```
These methods are very similar, because they both update the database with increasing the likes or dislikes value and also return a Json Response which can be parsed using JavaScript to update the html being shown to the user. My next task was to use AJAX to asynchronously add and delete comments on the blog post page. 
```c#
[HttpPost]
        public JsonResult deleteComment(int id)
        {
            Comment comment = db.Comments.Find(id);
            db.Comments.Remove(comment);
            db.SaveChanges();
            return Json("The comment was deleted successfully", JsonRequestBehavior.AllowGet); 

        }
```
The delete comment method is very simple. It finds the comment by id in the database, deletes it, and then returns a success message via Json Response. The Javascript does most of the "heavy lifting" for this type of page functionality. The next task was to create an asynchronous method to add a comment to the page without reloading. 
```c#
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
```
This method creates a new comment object, sets the message parameter to the methods input argument, and saves the new comment to the database. The Json Response being returned contains important information such as the CommentId, the comment message, and also the CommentDate (which is automatically set by the comment object constructor). Again, the Javascript does most of the heavy lifting here, especially with this functionality. 


### Text Helper: Limit Words
I was tasked to create a method that had input parameters of a string and an integer which returned a string containing the number of words indicated by the input integer.
```c#
 public static string LimitWords(string value, int number)
            {
                char[] delimiterChars = { ' ', ',', '.', ':', '\t' };
                //Use String.Split() method to "put" every word separated by a delimiting character into a
                //string array. StringSplitOptions.RemoveEmptyEntries removes extra delimiting characters.
                string[] words = value.Split(delimiterChars, StringSplitOptions.RemoveEmptyEntries);
                string result = "";
                if (value.Length > 0 && number > 0)
                {
                    if (words.GetLength(0) <= number)
                    {
                        foreach (string s in words)
                        {
                            result += " " + s;
                        }
                        return result + "...";
                    }
                    else
                    {
                        //if the length of the string array "words" is greater than the input parameter number
                        int i = 0;
                        while (i < number)
                        {
                            result += " " + words[i];
                            i++;
                        }
                        return result + "...";
                    }
                }
                //if the length of the string array is greater than 0 but the input parameter number is 0 or less,
                //return the string. if the string length is 0, return the string
                else
                {
                    foreach (string s in words)
                    {
                        result += " " + s;
                    }
                    return result + "...";
                }
            }
```
This was my first user story assigned to me, and I believe there are better ways to complete the same task. If I were to do it again, I would use the String.Substring() method.

*Jump to: [Front End Stories](#front-end-stories), [Back End Stories](#back-end-stories), [Other Skills](#other-skills-learned), [Page Top](#live-project)*

## Front End Stories
* [Comments Partial View](#comments-partial-view)
* [AJAX Methods: Add Like/Dislike](#ajax-methods-add-likedislike)
* [AJAX Methods: Add/Delete Comment](#ajax-methods-adddelete-comment)

### Comments Partial View
My task was to create a partial view to pass in all of the comments from the database. This partial view allowed me to keep the nav bar and footer functionality while implementing new functionalities to my "comments". Here is a gif of what the user would see. Please keep in mind that the formatting and styling of the comments was not an assigned user story, so I did not focus my limited time on those aspects. 

![](https://github.com/markedin/CSharp-Live-Project-Code-Review/blob/main/gifs/functionality.gif)


<details>
    <summary>Click here to show the HTML</summary>

```html
<button type="button" class="btn btn-warning comment-Index--create-comment-button" data-toggle="modal" data-target="#exampleModal">Create Comment</button>


<div class="modal fade modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">New Comment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="message-text" class="col-form-label">Message:</label>
                        <input id="comment-message-text" type="text" class="form-control" name="message">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button data-id="submit-button" type="button" data-dismiss="modal" class="btn btn-primary" value="CreateComment" onclick="addComment()"> Save Comment</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">New Reply</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="message-text" class="col-form-label">Message:</label>
                        <input id="comment-message-text" type="text" class="form-control" name="message">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button data-id="submit-button" type="button" data-dismiss="modal" class="btn btn-primary" value="CreateComment" onclick="addReply()"> Save Reply</button>
            </div>
        </div>
    </div>
</div>

<div id="top-of-comments"></div>

@foreach (var item in Model)
{

    <div id="comment-delete-alert-@item.CommentId" class="alert alert-success comment-Index--comment-delete-alert d-none" role="alert">
        <p id="comment-delete-alert-text-@item.CommentId" class="comment-Index--comment-delete-alert-text">test</p>
        <i class="fa fa-check comment-Index-comment-delete-alert-icons"></i>
    </div>
    <div class="modal fade" id="delete-comment-modal-@item.CommentId" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete comment</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this comment?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deleteComment(@item.CommentId)">Confirm</button>
                </div>
            </div>
        </div>
    </div>
    <div id="comment-container-@item.CommentId" class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="media g-mb-30 comment-Index--media-comment comment-Index--container comment-Index--shadow">
                    <div class="media-body  blog-comments--bg-secondary comment-Index--pa-30">
                        <div class="g-mb-15">
                            <h5 class="h5 mb-0">@Html.DisplayFor(modelItem => item.Author) posted:</h5>
                            <span class="comment-Index--textColor comment-Index--font-size-12"> @Comment.CommentTimePassed(item.CommentDate)</span>
                        </div>
                        <p class="color: white">
                            @Html.DisplayFor(modelItem => item.Message)
                        </p>
                        <div class="comment-Index--likes-dislikes-ratio">
                            <p class="comment-Index--likes-text"> Likes: </p>
                            <p id="likes-percentage-@item.CommentId" class="comment-Index--likes-percentage">@(Math.Round(item.LikeRatio(),0))% </p>
                            <p class="comment-Index--divider-text"> | </p>
                            <p class="comment-Index--dislikes-text">Dislikes: </p>
                            <p id="dislikes-percentage-@item.CommentId" class="comment-Index--dislikes-percentage">@(Math.Round((100-item.LikeRatio()), 0))% </p>
                        </div>
                        <div class="progress comment-Index--progress-bar">
                            <div id="likes-bar-@item.CommentId" class="progress-bar bg-success" role="progressbar" style="width:@item.LikeRatio()%" aria-valuenow="@item.LikeRatio()" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <ul class="list-inline d-sm-flex my-0">
                            <li class="comment-Index--list-inline-item g-mr-20">
                                <a class="u-link-v5 comment-Index--textColor g-color-primary--hover" style="padding-right: 10px">
                                    <i id="likes-value-@item.CommentId" class="fa fa-thumbs-up g-pos-rel g-top-1 g-mr-3" onclick="addLike(@item.CommentId)"> @Html.DisplayFor(modelItem => item.Likes)</i>
                                </a>
                            </li>
                            <li class="list-inline-item g-mr-20">
                                <a class="u-link-v5 comment-Index--textColor g-color-primary--hover">
                                    <i id="dislikes-value-@item.CommentId" class="fa fa-thumbs-down g-pos-rel g-top-1 g-mr-3" onclick="addDislike(@item.CommentId)"> @Html.DisplayFor(modelItem => item.Dislikes)</i>
                                </a>
                            </li>
                            <li class="list-inline-item ml-auto">
                                <button class="btn" data-toggle="modal" data-target="#add-reply-modal-@item.CommentId">
                                    <a class="u-link-v5 comment-Index--textColor g-color-primary--hover" href="#!">
                                        <i class="fa fa-reply g-pos-rel g-top-1 g-mr-3"></i>
                                        Reply
                                    </a>
                                </button>
                            </li>
                            <li class="list-inline-item ml-auto">
                                <button class="btn" data-toggle="modal" data-target="#delete-comment-modal-@item.CommentId">
                                    <a class="u-link-v5 comment-Index--textColor g-color-primary--hover">
                                        <i class="fa fa-trash g-pos-rel g-top-1 g-mr-3"></i>
                                        Delete
                                    </a>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

}

```
</details>



### AJAX Methods: Add Like/Dislike
My task was to implement asynchronous updates to the like and dislike values as well as the like/dislikes bar. I accomplished this task by using Javascript to make AJAX calls to my controller. 
```js
function addLike(id) {
    $.ajax({
        type: 'POST',
        url: "/Comments/addLike",
        data: { id: id },
        success: function (response) {
            var likes = response.Data[0];
            var likeRatio = response.Data[1].toFixed(0);
            $("#" + "likes-bar-" + id).css('width', likeRatio + '%');
            $("#" + "likes-percentage-" + id).text(likeRatio + "%");
            $("#" + "dislikes-percentage-" + id).text(100 - likeRatio + "%");
            $("#" + "likes-value-" + id).html(likes);
        }
    });
};

function addDislike(id) {
    $.ajax({
        type: 'POST',
        url: "/Comments/addDislike",
        data: { id: id },
        success: function (response) {
            var dislikes = response.Data[0];
            var likeRatio = response.Data[1].toFixed(0);
            $("#" + "likes-bar-" + id).css('width', likeRatio + '%');
            $("#" + "likes-percentage-" + id).text(likeRatio + "%");
            $("#" + "dislikes-percentage-" + id).text(100 - likeRatio + "%");
            $("#" + "dislikes-value-" + id).html(dislikes);
        }
    });

};        
```
These methods take in the comment id and pass it into the controller method that is being called. It then recieves a JsonResult back which is parsed and then used to update the html of the page. 

### AJAX Methods: Add/Delete Comment
My task was to create asynchronous updates to the page when the "delete" button was clicked, and also when a new comment was added. I accomplished this task by again using Javascript to make AJAX calls to my controller methods. The delete comment method is fairly simple. It removes the comment from the database using the controller method, and hides it by changing HTML class elements. 
```js
function deleteComment(id) { 
    $.ajax({
        type: 'POST',
        url: "/Comments/deleteComment",
        data: { id: id },
        success: function (response) {
            $("#" + "comment-container-" + id).hide(1000);
            $("#" + "comment-delete-alert-text-" + id).text(response);
            $("#" + "comment-delete-alert-" + id).addClass('d-inline-block').removeClass('d-none');
            
            setTimeout(() => {
                $("#" + "comment-delete-alert-" + id).alert('close');
            }, 3000);

        }
    });  
};
```
The addComment() method looks complex but is simple. It generates HTML and inserts it by using the .after() method so the new comment will always be added at the top of the page. All of the comments are sorted chronologically. 

<details>
    <summary>Click here to show the addComment() method</summary>

```js
function addComment() {
    var message = $('#comment-message-text').val();

    $.ajax({
        type: 'POST',
        url: "/Comments/addComment",
        data: {
            message: message

        },
        success: function (response) {

            var lastDiv = $('#top-of-comments');




            $(lastDiv).after(['<div id="comment-delete-alert-'+response.Data[0]+'" class="alert alert-success comment-Index--comment-delete-alert d-none" role="alert">',
                                            '<p id="comment-delete-alert-text-'+response.Data[0]+'" class="comment-Index--comment-delete-alert-text"></p>',
                                            '<i class="fa fa-check comment-Index-comment-delete-alert-icons"></i>',
                                        '</div>',
                                            '<div class="modal fade" id="delete-comment-modal-' + response.Data[0] +'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">',
                                                '<div class="modal-dialog" role="document">',
                                                    '<div class="modal-content">',
                                                        '<div class="modal-header">',
                                                        '<h5 class="modal-title" id="exampleModalLabel">Delete comment</h5>',
                                                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">',
                                                            '<span aria-hidden="true">&times;</span>',
                                                        '</button>',
                                                        '</div>',
                                                        '<div class="modal-body">',
                                                            'Are you sure you want to delete this comment?',
                                                        '</div>',
                                                        '<div class="modal-footer">',
                                                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>',
                                                            '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deleteComment(' + response.Data[0] +')">Confirm</button>',
                                                        '</div>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<div id="comment-container-' + response.Data[0] +'" class="container">',
                                                '<div class="row">',
                                                    '<div class="col-md-8">',
                                                       '<div class="media g-mb-30 comment-Index--media-comment comment-Index--container style:"background-color: var(--secondary-color);" comment-Index--shadow">',
                                                            '<div class="media-body  blog-comments--bg-secondary comment-Index--pa-30">',
                                                                '<div class="g-mb-15">',
                                                                    '<h5 class="h5 mb-0">Author posted:</h5>',
                                                                     '<span class="comment-Index--textColor comment-Index--font-size-12">' + response.Data[2] +'</span>',
                                                                '</div>',
                                                                '<p class="color: white">',
                                                                    response.Data[1],
                                                                '</p>',
                                                                '<div class="comment-Index--likes-dislikes-ratio">',
                                                                    '<p class="comment-Index--likes-text"> Likes: </p>',
                                                                    '<p id="likes-percentage-' + response.Data[0] +'class="comment-Index--likes-percentage"> 0% </p>',
                                                                    '<p class="comment-Index--divider-text"> | </p>',
                                                                    '<p class="comment-Index--dislikes-text">Dislikes: </p>',
                                                                    '<p id="dislikes-percentage-' + response.Data[0] +'" class="comment-Index--dislikes-percentage"> 0% </p>',
                                                                '</div>',
                                                                '<div class="progress comment-Index--progress-bar">',
                                                                    '<div id="likes-bar-' + response.Data[0] +'" class="progress-bar bg-success" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>',
                                                                '</div>',
                                                                '<ul class="list-inline d-sm-flex my-0">',
                                                                    '<li class="comment-Index--list-inline-item g-mr-20">',
                                                                        '<a class="u-link-v5 comment-Index--textColor g-color-primary--hover" style="padding-right: 10px">',
                                                                        '<i id="likes-value-' + response.Data[0] + '" class="fa fa-thumbs-up g-pos-rel g-top-1 g-mr-3" onclick="addLike(' + response.Data[0] +')"> 0 </i>',
                                                                        '</a>',
                                                                    '</li>',
                                                                    '<li class="list-inline-item g-mr-20">',
                                                                        '<a class="u-link-v5 comment-Index--textColor g-color-primary--hover">',
                                                                        '<i id="dislikes-value-' + response.Data[0] + '" class="fa fa-thumbs-down g-pos-rel g-top-1 g-mr-3" onclick="addDislike(' + response.Data[0] +')"> 0 </i>',
                                                                        '</a>',
                                                                    '</li>',
                                                                    '<li class="list-inline-item ml-auto">',
                                                                        '<a class="u-link-v5 comment-Index--textColor g-color-primary--hover">',
                                                                            '<i class="fa fa-reply g-pos-rel g-top-1 g-mr-3"></i>',
                                                                            'Reply',
                                                                        '</a>',
                                                                    '</li>',
                                                                    '<li class="list-inline-item ml-auto">',
                                                                    '<button class="btn" data-toggle="modal" data-target="#delete-comment-modal-' + response.Data[0]+ '">',
                                                                    '<a class="u-link-v5 comment-Index--textColor g-color-primary--hover">',
                                                                                '<i class="fa fa-trash g-pos-rel g-top-1 g-mr-3"></i>',
                                                                                'Delete',
                                                                            '</a>',
                                                                        '</button>',
                                                                    '</li>',
                                                                '</ul>',
                                                            '</div>',
                                                        '</div>',
                                                    '</div>',
                                                '</div>',
                '</div>'].join("\n"));
        }
    });
};

```
</details>







*Jump to: [Front End Stories](#front-end-stories), [Back End Stories](#back-end-stories), [Other Skills](#other-skills-learned), [Page Top](#live-project)*

## Other Skills Learned
* Working with a group of developers to identify front and back end bugs to improve usability of an application
* Improving project flow by communicating about who needs to check out which files for their current story
* Learning new efficiencies from other developers by observing their workflow and asking questions


*Jump to: [Front End Stories](#front-end-stories), [Back End Stories](#back-end-stories), [Other Skills](#other-skills-learned), [Page Top](#live-project)*


