/**
 * Created by Denys Bondarenko on 7/29/2015.
 */
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    cluster = require("cluster"),
    os = require("os");

port = process.argv[2] || 8880;

var numCPUs = os.cpus().length;

if(cluster.isMaster){

    for (var i = 0; i < numCPUs; ++i) {
    cluster.fork();
}
  
}else{
http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname,
        appPath = process.cwd().replace(/server/g,'')
        , filename = path.join(appPath, uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));
}

cluster.on('online', function(worker){
    console.log("Worker "+ worker.id + ' has been started.');
});