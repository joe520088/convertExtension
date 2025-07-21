"use strict";
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
    function handleFile(f)
    {
         // Check if file is a PowerPoint file
        if (!f.name.match(/\.(ppt|pptx)$/i)) {
            $result.append($("<div>", {
                "class": "alert alert-danger",
                text: "Error: " + f.name + " is not a PowerPoint file. Please select a .ppt or .pptx file."
            }));
            return;
        }
        var $title = $("<h4>",
            {
                text : f.name
            }
        );
        // after is finished is adding the file name to unorder list
        var $fileContent = $("<ul>");
        $result.append($title);
        $result.append($fileContent);

        // new Date for automatically convert the time
        var dateBefore = new Date();
        JSZip.loadAsync(f).then(function(zip)
        {
            // Example: Read and parse the first slide's XML
            zip.file("ppt/slides/slide1.xml").async("text").then(function(xmlText) 
            {
            // Use fast-xml-parser to parse the XML text
            const parser = new XMLParser(); 
            const slideObj = parser.parse(xmlText);
           
            // Convert the object back to XML string for microsoft word 
            const builder = new XMLBuilder();
            const xmlString = builder.build(slideObj);

            // Optionally, show some info in your UI
            $fileContent.append($("<li>", { text: "Parsed slide1.xml" }));
            }).catch(function(err) 
            {
            $fileContent.append($("<li>", { text: "Could not read slide1.xml: " + err.message }));
            });
            // this part of code is use to calculate how long it read the file 
            var dateAfter = new Date();
            $title.append($("<span>",{ "class" : "small", text:"(loaded in " + (dateAfter - dateBefore) + "ms)"}));

            // this goes through the zip file that use has put in the drop box
            zip.forEach(function(relativePath, zipEntry)
            {
                $fileContent.append($("<li>",{text : zipEntry.name}));
            });
            // this part of function is for catch error if the file can't be read
        },function(e)
        {
            $result.append($("<div>",{"class" : "alert alert-danger",
                text : "Error reading " + f.name + ": " + e.message
            }));
        });

    }
    // going through the file if is needed not actaully reading the data
    var files = event.target.files;
    for(var i = 0; i < files.length; i++)
    {
        handleFile(files[i]);
    }

});