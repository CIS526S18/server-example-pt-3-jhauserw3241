/** @module multipart
 * A module for parsing multipart form bodies.
 */

module.exports = multipart;

/** @function multipart
 * @param {string} req - The request object
 * @param {string} res - The response object
 * @param {callback function} next - The callback function for the next thing to do
 */
function multipart(req, res, next) {
    var chunks = [];

    // Read in form data chunk-by-chunk
    req.on('data', function(chunk) {
        chunks.concat(chunk);
    });

    // Parse the body of the form
    req.on('end', function() {
        var buffer = Buffer.concat(chunks);

        // Get the boundary to be able to differentiate between parts of the body
        var match = /boundary=(.+);?/.exec(req.headers['content-type']);
        if(match) {
            // TODO: Parse body
            parseMultipartBody(match[1]);
            next(req, res);
        }
        // Could not find boundary bytes so cannot parse form body
        else {
            res.statusCode = 500;
            res.end("Server error")
        }
    });

    // Handle timeout errors or other errors while handling the form data
    req.on('error', function(err) {
        console.log(err);
        res.statusCode = 500;
        res.end("Server error");
    });
}