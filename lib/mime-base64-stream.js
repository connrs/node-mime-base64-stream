var Transform = require('stream').Transform;
var LINE_LENGTH = 76;

function MimeBase64Stream() {
  this._chunkBuffer = [];
  this._lineCount = 0;
  this._lineOffset = 0;
  Transform.call(this);
}

MimeBase64Stream.prototype = Object.create(Transform.prototype, {
  constructor: MimeBase64Stream
});

MimeBase64Stream.prototype._transform = function (chunk, encoding, done) {
  var chunkLength;
  var remainder;

  if (this._isBufferingData()) {
    chunk = this._concatChunkToBuffer(chunk);
  }

  chunkLength = chunk.length;
  remainder = chunkLength % 3;

  if (remainder !== 0) {
    this._chunkBuffer = chunk.slice(chunkLength - remainder);
    chunk = chunk.slice(0, chunkLength - remainder);
  }

  this._pushBase64Chunk(chunk.toString('base64'));
  done();
};

MimeBase64Stream.prototype._flush = function (done) {
  this._pushBase64Chunk(this._popChunkBuffer().toString('base64'));
  done();
};

MimeBase64Stream.prototype._isBufferingData = function () {
  return this._chunkBuffer.length > 0;
};

MimeBase64Stream.prototype._concatChunkToBuffer = function (chunk) {
  if (!this._isBufferingData()) {
    return chunk;
  }

  return Buffer.concat([this._popChunkBuffer(), chunk]);
};

MimeBase64Stream.prototype._popChunkBuffer = function () {
  var chunkBuffer = this._chunkBuffer;
  this._chunkBuffer = [];
  return chunkBuffer;
};

MimeBase64Stream.prototype._pushBase64Chunk = function (chunk) {
  if (this._base64ChunkIsEmpty(chunk)) {
    return;
  }

  if (this._base64ChunkLengthLessThanLineLength(chunk)) {
    this._pushEntireBase64Chunk(chunk);
  }
  else {
    this._pushPartialBase64Chunk(chunk, LINE_LENGTH - this._lineOffset);
  }
};

MimeBase64Stream.prototype._base64ChunkIsEmpty = function (chunk) {
  return chunk.length === 0;
};

MimeBase64Stream.prototype._base64ChunkLengthLessThanLineLength = function (chunk) {
  return chunk.length <= LINE_LENGTH + this._lineOffset;
};

MimeBase64Stream.prototype._pushEntireBase64Chunk = function (chunk) {
  this.push(this._lineSeparator() + chunk);
  this._updateLineOffset(this._lineOffset + chunk.length);
  this._lineCount++;
};

MimeBase64Stream.prototype._lineSeparator = function () {
  return this._lineOffset === 0 && this._lineCount > 0 ? '\r\n' : '';
};

MimeBase64Stream.prototype._updateLineOffset = function (offset) {
  this._lineOffset = offset % LINE_LENGTH;
};

MimeBase64Stream.prototype._pushPartialBase64Chunk = function (chunk, index) {
  this.push(this._lineSeparator() + chunk.substr(0, index));
  this._updateLineOffset(0);
  this._lineCount++;
  this._pushBase64Chunk(chunk.substr(index));
};

function mimeBase64Stream() {
  var stream = new MimeBase64Stream();
  return stream;
}

module.exports = mimeBase64Stream;
