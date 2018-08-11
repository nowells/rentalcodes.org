const execa = require('execa');
const static = require('node-static');
const http = require('http');
var file = new static.Server('.');

(async() => {
    const server = http.createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        }).resume();
    })

    await new Promise((resolve, reject) => {
        server.listen(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

    await execa('wait-on', [`tcp:${server.address().port}`]);

    const results = await execa('blc', ['-ro', `http://localhost:${server.address().port}`])

    console.log(results.stdout);
    console.error(results.stderr);

    server.close();

    if (results.code !== 0) {
        process.exit(1);
    }
})();
