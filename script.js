"use stric";
var $result = $("#result");

document.getElementById("file").addEventListener('change',function(event)
{
    // getting the file from the drop box
    const file = event.target.files;
    // check for is there any file 
    if(!file.length) return;

    // making the part of html empty when the user input a new file
    $result.html("");
    // making sure the class is removed to completely wiped it off 
    $("#result_block").removeClass("hidden").addClass("show");

    // handle file and adding small header to show after the file is completed
    function handeFile(f)
    {
        var $title = $("<h4>",
            {
                text : f.name
            }
        );
        // after is finished is adding the file name to unorder list
        var $fileContent = $("<ul>");
        $result.append($title);
        $result.append($fileContent);

    }

});