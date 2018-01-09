$(function () {

    $("#editFolder").addClass("hiddenBlock");
    $("#addFolder").addClass("hiddenBlock");

    //$("#listFolders").draggable();

    GetFolders();

    $("#listFolders").on("click", function (event) {
        event.preventDefault();
        var target = event.target;

        //$("#editFolder label").val("");

        if (target.tagName === 'BUTTON') {

            OnClickButton(target);
        }
    });

    $("#saveFolder").on("click", function (event) {
        event.preventDefault();
        //var target = event.target;
        FolderRename(event.target);
    });

    $("#addNewFolder").on("click", function (event) {
        event.preventDefault();

        FolderAdd(event.target);
    });



    //$("#addBook").click(function (event) {
    //    event.preventDefault();
    //    AddBook();
    //});

    function GetFolders(idButton, subfolders) {
        var result;
        if (idButton === undefined) {
            $.ajax({
                url: '/api/folder',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    WriteFirstResponse(data);
                    DraggableFolders();
                },
            });
        }
        if (subfolders !== undefined) {
            $.ajax({
                url: '/api/folder/subfolder/' + idButton,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    WriteResponseFolders(data, subfolders);
                    DraggableFolders();
                },
            });
        }
    }

    function OnClickButton(target) {
        var cssClassButton = target.className;
        if (cssClassButton.indexOf('folderClosed') > 0) {
            var parentId = "#" + target.parentElement.id;
            var subFolders = $(parentId).find('.subFolders').eq(0);
            var idFolder = target.firstChild.value;
            GetFolders(idFolder, subFolders);

            target.className = target.className.replace("folderClosed", "folderOpen");
        }
        if (cssClassButton.indexOf("folderOpen") > 0) {
            var parentId = "#" + target.parentElement.id;
            var subFolders = $(parentId).find('.subFolders').eq(0);
            subFolders.html("");

            target.className = target.className.replace("folderOpen", "folderClosed");
        }
        if (cssClassButton.indexOf("folderRename") > 0) {

            FolderFormRename(target);
        }
        if (cssClassButton.indexOf("folderDelete") > 0) {
            FolderDelete(target);
        }
        if (cssClassButton.indexOf("folderAdd") > 0) {
            FolderFormAdd(target);
        }

    }

    function WriteFirstResponse(folders) {
        var strResult = GetHTMLforFolders(folders);
        $("#listFolders").html(strResult);
    }

    function WriteResponseFolders(folders, subFolders) {
        var htmlString = GetHTMLforFolders(folders);
        subFolders.html(htmlString);
    }

    function GetHTMLforFolders(folders) {
        var htmlString = "";
        var buttonRename = "<button type=\"button\" class=\"btn btn-default btn-lg col-xs-1 imageButton folderRename\"></button>";
        var buttonDelete = "<button type=\"button\" class=\"btn btn-default btn-lg col-xs-1 imageButton folderDelete\"></button>";
        var buttonAdd = "<button type=\"button\" class=\"btn btn-default btn-lg col-xs-1 imageButton folderAdd\"> </button >";

        $.each(folders, function (index, folder) {
            htmlString += "<div id=" + folder.Name + " class=\"col-xs-12 folder\">";
            var hiddenField = "<input type=\"hidden\" value=\"" + folder.Id + "\"/>";
            var buttonFolder = "<button type=\"button\" class=\"btn btn-default btn-lg col-xs-1 imageButton folderClosed buttonClickOpen\">" + hiddenField + " </button >";
            //var buttonFolderName = "<span id=\"folderName\" class=\"col-xs-9\">" + folder.Name + "</span>";
            var buttonFolderName = "<span class=\"col-xs-8\">" + folder.Name + "</span>";

            var subfolderFolder = "<div class=\"subFolders\"> </div>";

            htmlString += buttonFolder + buttonFolderName + buttonAdd + buttonRename + buttonDelete + subfolderFolder;

            htmlString += "</div>";
        });
        return htmlString;
    }
    var renameObject;

    function FolderFormRename(target) {
        renameObject = target.parentElement;
        var nameFolder = target.parentElement.id;
        $("#nameFolder").text(nameFolder);
        $("#newNameFolder").val(nameFolder);
        var idFolder = target.parentElement.firstChild.firstChild.value;
        $("#idEditFolder").val(idFolder);

        var inputVal = $("#" + nameFolder + " .parentId").val();
        $("#idParentFolder").val(inputVal);

        //$("#editFolder").css("display", "normal");
        $("#editFolder").removeClass("hiddenBlock");
    }

    function FolderRename() {
        var newNameFolder = $("#newNameFolder").val();

        var folder = {
            Id: $("#idEditFolder").val(),
            Name: newNameFolder,
            ParentId: $("#idParentFolder").val()
        };
        $.ajax({
            url: "/api/folder",
            data: folder,
            type: "POST",
            success: function (data) {
                if (data === 200) {
                    renameObject.id = newNameFolder;
                    $(renameObject).children("span").html(newNameFolder);
                    $("#editFolder").addClass("hiddenBlock");
                }
            }
        });
    }

    function FolderDelete(target) {
        var idRemoveHTMLElement = target.parentElement.id;

        var message = "Do you want remove this folder: " + idRemoveHTMLElement + " ?";

        if (confirm(message)) {
            var idRemoveFolder = $("#" + idRemoveHTMLElement).children().eq(0).children("input").val();

            $.ajax({
                url: "/api/folder/" + idRemoveFolder,
                type: "DELETE",
                success: function (data) {
                    if (data === 200) {
                        $("#" + idRemoveHTMLElement).remove();
                    }
                },
            });
        }
    }
    var whereAddFolder;
    function FolderFormAdd(target) {
        whereAddFolder = target.parentElement;
        var idFolder = target.parentElement.firstChild.firstChild.value;
        //$("#nameFolder").text("Add new folder");
        $("#idAddParentFolder").val(idFolder);
        $("#newFolderName").val("");

        $("#addFolder").removeClass("hiddenBlock");
    }

    function FolderAdd(target) {
        var nameFolder = $("#newFolderName").val();

        var folder = {
            Id: 0,
            Name: nameFolder,
            ParentId: $("#idAddParentFolder").val()
        };
        $.ajax({
            url: "/api/folder",
            data: folder,
            type: "PUT",
            success: function (data) {
                //if (data === 200) {
                //    whereAddFolder.id = nameFolder;
                //    $(whereAddFolder).children("span").html(nameFolder);
                //    $("#editFolder").addClass("hiddenBlock");
                //}
                var parentId = "#" + target.parentElement.id;
                var subFolders = $(parentId).find('.subFolders').eq(0);

                var htmlString = GetHTMLforFolders(data);
                subFolders.html(htmlString);
            }
        });
        $("#addFolder").addClass("hiddenBlock");
    }


    function DraggableFolders() {
        //$("#listFolders").draggable();
        $(".folder").draggable();
        //$(".folder").droppable({
        //    over: function () {
        //        $(".folder").addClass("folderDropLight");
        //    },
        //    out: function () {
        //        $(".folder").removeClass("folderDropLight");
        //    }
        //});
    }x

});





