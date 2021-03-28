const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.innerBuffer = "";
  }

  _transform(chunk, encoding, callback) {
    let splittedChunk = chunk.toString().split(os.EOL);
    splittedChunk[0] = `${this.innerBuffer}${splittedChunk[0]}`;
    this.innerBuffer = splittedChunk.pop();
    if (splittedChunk.length > 0) {
      splittedChunk.forEach((peace) => this.push(peace));
    }
    callback();
  }

  _flush(callback) {
    this.push(this.innerBuffer);
    callback();
  }
}

module.exports = LineSplitStream;
