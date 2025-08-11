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

    // function to collect all the text from the slide
    function collectSliderText(node, out)
    {
        if(!node || typeof node !== 'object') return;

        if (node["a:t"] != null) 
        {
            const v = node["a:t"];
            if (Array.isArray(v)) v.forEach(s => { if (typeof s === "string") out.push(s); });
            else if (typeof v === "string") out.push(v);
        }
        for (const k in node) 
        {
            if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
            const child = node[k];
            if (Array.isArray(child)) child.forEach(c => collectSlideTexts(c, out));
            else if (typeof child === "object" && child !== null) collectSlideTexts(child, out);
        }
    }
        // Build a .docx where each slide is a heading + bullet list and download it
        async function exportSlidesToDocx(slideChunks, filename = "slides.docx") {
        const { Document, Packer, Paragraph, HeadingLevel } = window.docx;

        const docChildren = [];

         slideChunks.forEach((slide, idx) => {
        // Slide heading
        docChildren.push(
            new Paragraph({
            text: `Slide ${idx + 1}`,
            heading: HeadingLevel.HEADING_1,
        })
      );

      // Bullet each text chunk (skip empties/whitespace)
        slide
            .filter(s => s && s.trim().length > 0)
            .forEach(s => {
                docChildren.push(
                new Paragraph({
                text: s,
                bullet: { level: 0 }
            })
          );
        });

      // Spacer between slides
      docChildren.push(new Paragraph({ text: "" }));
    });

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  }

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
            const parser = new XMLParser();
            const builder = new XMLBuilder();

            const slideFiles = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/i.test(name));

            Promise.all(slideFiles.map(name =>
            zip.file(name).async("text").then(xml => {
                const obj = parser.parse(xml);
                const xmlStr = builder.build(obj);
                $fileContent.append($("<li>", { text: `Parsed ${name}` }));
                return { name, slideObj: obj };
            }).catch(err => {
                $fileContent.append($("<li>", { text: `Error parsing ${name}: ${err.message}` }));
            return null;
        })
        )).then(parsedSlides => {
        console.log("Slides:", parsedSlides.filter(Boolean));
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