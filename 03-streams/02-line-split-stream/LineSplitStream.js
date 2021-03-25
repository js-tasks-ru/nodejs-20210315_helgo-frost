const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.bufer = "";
  }

  _transform(chunk, encoding, callback) {
    let splited = chunk.toString().split(os.EOL);

    splited.forEach((p, index, arr) => {
      if (index == arr.length - 1) {
        this.bufer = p.toString();
        return;
      }
      this.push(p.toString());
    });

    callback();
  }

  _flush(callback) {
    callback(null, this.bufer);
  }
}

module.exports = LineSplitStream;
