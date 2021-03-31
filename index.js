const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((request, result) => {
  //build a path
  let pagePath = path.join(
    __dirname,
    "public",
    request.url === "/" ? "index.html" : request.url
  );

  //type of file on the path?
  let typeofFile = path.extname(pagePath);
  let contentType = "text/html";
  switch (typeofFile) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // fix if no .html file extension
  if (contentType == "text/html" && typeofFile == "") pagePath += ".html";

  fs.readFile(pagePath, (err, data) => {
    if (err) {
      if (err.code == "ENOENT") {
        // 404
        fs.readFile(path.join(__dirname, "public", "404.html"), (err, data) => {
          result.writeHead(404, { "Content-Type": "text/html" });
          result.end(data, "utf8");
        });
      } else {
        //  other server error
        result.writeHead(500);
        result.end(`Server Error: ${err.code}`);
      }
    } else {
      result.writeHead(200, { "Content-type": contentType });
      result.end(data, "utf8");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`PORT # ${PORT}`));
