PowerPoint to Microsoft Word Converter
A client-side JavaScript tool that extracts text from PowerPoint (.pptx) files and generates a formatted Microsoft Word (.docx) document for easy note-taking.
Key Features:

File Upload & Validation – Uses the HTML File API to handle .ppt and .pptx uploads and validate file types.
PowerPoint Parsing – Utilizes JSZip to read compressed PPTX files and fast-xml-parser to parse slide XML files.
Text Extraction – Recursively traverses XML nodes to extract all slide text content.
Document Generation – Uses docx.js to create a Word document where each slide is a heading followed by bullet points of extracted text.
Download Functionality – Implements FileSaver.js to allow users to download the generated .docx file.
Performance Measurement – Calculates and displays the time taken to read and process the uploaded file.
Error Handling – Provides clear error messages for invalid file types or parsing issues.

Technologies Used:
JavaScript (DOM manipulation, async/await, Promises)
HTML, CSS, jQuery
JSZip – PPTX file extraction
fast-xml-parser – XML parsing and rebuilding
docx.js – Word document generation
FileSaver.js – Client-side file saving
