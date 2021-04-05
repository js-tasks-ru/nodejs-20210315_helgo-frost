const url = require("url");
const http = require("http");
const path = require("path");
const LimitSizeStream = require("./LimitSizeStream");
const fs = require("fs");
const { stat, unlink } = require("fs/promises");

const server = new http.Server();

server.on("request", async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST":
      if (path.parse(filepath).dir != path.join(__dirname, "files")) {
        res.statusCode = 400;
        res.end("Wrong path!");
        return;
      }

      try {
        await stat(filepath);
        res.statusCode = 409;
        res.end("File already exists!");
        return;
      } catch (err) {
        console.log(err);
      }

      const fileStream = fs.createWriteStream(filepath);
      const limitStream = new LimitSizeStream({ limit: 2 ** 20 });
      req.pipe(limitStream).pipe(fileStream);

      limitStream.on("error", async () => {
        await unlink(filepath);
        res.statusCode = 413;
        res.end("File size limit exceeded!");
        return;
      });

      req.on("aborted", async () => {
        await unlink(filepath);
      });

      fileStream.on("finish", () => {
        res.statusCode = 201;
        res.end("OK");
      });
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
