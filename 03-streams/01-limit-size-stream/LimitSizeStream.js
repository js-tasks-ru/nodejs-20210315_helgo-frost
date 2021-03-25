const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this._totalBytesTransfered = 0;
  }

  _transform(chunk, encoding, callback) {
    this._totalBytesTransfered += chunk.length;
    this._totalBytesTransfered > this.limit
      ? callback(new LimitExceededError())
      : callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
