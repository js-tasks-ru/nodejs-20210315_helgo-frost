const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {stat} = require('fs/promises')

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try{
        await stat(filepath)
        const stream = fs.createReadStream(filepath)
        stream.pipe(res)
        res.statusCode = 200;
        res.on('close', () => {
          stream.destroy();
        });
        

      } catch (e) {
        const statusCode = (path.parse(filepath).dir != path.join(__dirname, 'files')) ?  400 : 404
        res.statusCode = statusCode
        res.end('File not exist or filepath is wrong!');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
server.on('error', (req, res) => {
  res.statusCode = 500;
  res.end();
})

module.exports = server;
