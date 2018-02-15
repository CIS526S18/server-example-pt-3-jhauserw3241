const fs = require('fs');

module.exports = {
    getStudents: getStudents,
    addStudent: addStudent
};

/* Load sync files into a global variable
 * This serves as an in-memory cache for speedy access.
 */
var students = JSON.parse(fs.readFileSync("students.json", {encoding: 'utf-8'}));

/** @function getStudents
 * Provide a list of students
 * @return {Array} array of student objects
 */
function getStudents() {
    return JSON.parse(JSON.stringify(students));
}

/** @function addStudent
 * Add a student to the list of students
 * Callback parameters are (error, student)
 * @param {Object} student - the student to add
 * @param {function} callback - a callback function to  call when this operation finishes
 */
function addStudent(student, callback) {
    // TODO: Validate student object    
    if(1 == 1) {
        students.push(JSON.parse(JSON.stringify(student)));

        // Save cache to hard drive
        fs.writeFile("students.json", {encoding: 'utf-8'}, JSON.stringify(students));

        callback(false, student);
    } else {
        callback(true, student);
    }
}

// TODO: Add removeStudent function
