
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


function addReply(parent) {
    $.ajax({
        type: 'POST',
        url: "/Comments/addReply",
        data: {
            message: message

        },
        success: function (response) {

            var lastDiv = $('#top-of-comments');
}