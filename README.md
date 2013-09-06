#MIME Base64 Stream

[![Travis CI Test Status](https://travis-ci.org/connrs/node-mime-base64-stream.png)](https://travis-ci.org/connrs/node-mime-base64-stream)

Transform content in to base64 wrapped at 76 characters for MIME emails

    npm install mime-base64-stream

To use:

    var mimeBase64Stream = require('mime-base64-stream');

    content.pipe(mimeBase64Stream()).pipe(process.stdout);
