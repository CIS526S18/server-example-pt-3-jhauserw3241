const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const students = require('./model/students');

const PORT = 3000;

/** @function escapeHTML
  * A helper function for sanitizing user input by
  * escaping less-than and greater-than symbols (<>).
  * This has the practical effect of transforming html
  * into text.
  * @param {String} html - the html to escape
  * @return {String} the escaped html
  */
function escapeHTML(html) {
  // String.prototype.replace can take a regular expression as an argument.
  // the regular expression /</g means "all < in the string"
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** @function studentList
  * Returns a formatted list of student's names drawn from the
  * global students variable.
  * @return {String} an html fragment of the student's names
  */
function studentList() {
  return students.getStudents().map(function(item) {
    return item.name;
  }).join(", ");
}

/** @function studentForm
  * Returns an HTML form for creating additional students.
  * @return {String} the html form
  */
function studentForm() {
  var form = "<form method='POST'>";
  form +=    "  <fieldset>";
  form +=    "   <label for='name'>Student Name</label>";
  form +=    "   <input type='text' name='name'/>";
  form +=    "  </fieldset>";
  form +=    "  <fieldset>";
  form +=    "   <label for='eid'>Student Eid</label>";
  form +=    "   <input type='text' name='eid'/>";
  form +=    "  </fieldset>";
  form +=    "  <fieldset>";
  form +=    "   <label for='description'>Description</label>";
  form +=    "   <textarea name='description'></textarea>";
  form +=    "  </fieldset>";
  form +=    "  <fieldset>";
  form +=    "   <label for='photo'>Photo</label>";
  form +=    "   <input type='file' name='photo' />";
  form +=    "  </fieldset>";
  form +=    "  <input type='submit' value='add student'/>";
  form +=    "</form>"
  return form;
}

/** @function handleRequest
  * Handles requests to the webserver by rendering a page listing
  * students, and processing any new student additions submitted
  * through an HTTP request.
  * @param {http.ClientRequest} req - the client request object
  * @param {htt.ServerResponse} res - the server response object
  */
function handleRequest(req, res) {

  // Check for form submittal
  if(req.method === "POST") {
    var body = "";

    // Handle incoming data - append it to 
    // the body 
    req.on('data', function(data) {
      body += data;
    });

    // Once the entire body has loaded, parse the 
    // student object out of it.
    req.on('end', function(){
      var student = qs.parse(body);

      students.addStudent(student);
    });
  }

  // Render the page
  var html = "<!doctype html>";
  html +=    "  <html>";
  html +=    "    <head>";
  html +=    "      <title>Hello World</title>";
  html +=    "    </head>";
  html +=    "    <body>";
  html +=    "      <h1>";
  html +=    "         Hello World";
  html +=    "      </h1>";
  html +=    studentList();
  html +=    studentForm();
  html +=    "    </body>";
  html +=    "  </html>";
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

// Create the webserver
var server = http.createServer(handleRequest);

// Start listening for HTTP requests
server.listen(PORT, function() {
  console.log("Listening at port ", PORT);
});
