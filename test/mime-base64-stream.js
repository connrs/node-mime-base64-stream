var test = require('tape');
var base64;
var mimeBase64Stream = require('..');

function streamed(stream, func) {
  var output = [];
  stream.on('data', output.push.bind(output));
  stream.on('end', function () {
    func.call(null, Buffer.concat(output).toString());
  });
}

test('Convert one character', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'YQ==');
  });
  base64.end('a');
});

test('Convert two characters', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'YWE=');
  });
  base64.write('a');
  base64.end('a');
});

test('Convert three characters', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'YWFh');
  });
  base64.write('a');
  base64.write('a');
  base64.end('a');
});

test('Wrap long lines', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4g\r\nTWFlY2VuYXMgZmF1Y2lidXMgY29tbW9kbyBpcHN1bSB2ZWwgZnJpbmdpbGxhLiBNb3JiaSB0ZW1w\r\ndXMgZWxpdCBhIG1pIHRlbXBvciwgYSBsdWN0dXMgdXJuYSB0ZW1wb3IuIFByYWVzZW50IGp1c3Rv\r\nIGRvbG9yLCBjb252YWxsaXMgbGFvcmVldCB0ZWxsdXMgc2VkLCBtb2xlc3RpZSBzb2RhbGVzIHRv\r\ncnRvci4gRHVpcyBhYyBtYXVyaXMgZXUgZXJvcyBlbGVtZW50dW0gaGVuZHJlcml0LiBTdXNwZW5k\r\naXNzZSBqdXN0byBuaXNpLCBzb2xsaWNpdHVkaW4gc2l0IGFtZXQgc3VzY2lwaXQgdml0YWUsIHZv\r\nbHV0cGF0IHJ1dHJ1bSBuaXNpLiBBbGlxdWFtIHF1aXMgYWNjdW1zYW4gbmVxdWUuIEV0aWFtIGxp\r\nYmVybyBtYWduYSwgcGxhY2VyYXQgZWdldCBkdWkgc2VkLCBsdWN0dXMgZGlnbmlzc2ltIG51bmMu\r\nIFV0IG1vbGxpcyBwdXJ1cyBwdXJ1cywgaW4gcHVsdmluYXIgcHVydXMgc29kYWxlcyBuZWMuIElu\r\ndGVnZXIgbmVjIGxpYmVybyBtb2xsaXMsIHNlbXBlciBlcm9zIGlkLCBzZW1wZXIgb2Rpby4gTW9y\r\nYmkgdGluY2lkdW50IHF1YW0gYW50ZSwgYSB2b2x1dHBhdCBuaWJoIGhlbmRyZXJpdCB2ZWwuIEZ1\r\nc2NlIGV1IHN1c2NpcGl0IGxvcmVtLiBOdWxsYW0gZXQgdHVycGlzIGF0IG9kaW8gZmV1Z2lhdCBp\r\nbXBlcmRpZXQuIE51bGxhIGlkIG5pYmggc2FwaWVuLiBEdWlzIGx1Y3R1cyBsZWN0dXMgdml0YWUg\r\ndGVsbHVzIGN1cnN1cyBtb2xsaXMuIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0\r\nZXR1ciBhZGlwaXNjaW5nIGVsaXQu');
  });
  base64.end('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus commodo ipsum vel fringilla. Morbi tempus elit a mi tempor, a luctus urna tempor. Praesent justo dolor, convallis laoreet tellus sed, molestie sodales tortor. Duis ac mauris eu eros elementum hendrerit. Suspendisse justo nisi, sollicitudin sit amet suscipit vitae, volutpat rutrum nisi. Aliquam quis accumsan neque. Etiam libero magna, placerat eget dui sed, luctus dignissim nunc. Ut mollis purus purus, in pulvinar purus sodales nec. Integer nec libero mollis, semper eros id, semper odio. Morbi tincidunt quam ante, a volutpat nibh hendrerit vel. Fusce eu suscipit lorem. Nullam et turpis at odio feugiat imperdiet. Nulla id nibh sapien. Duis luctus lectus vitae tellus cursus mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
});

test('Wrap long lines as multiple chunks', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4g\r\nTWFlY2VuYXMgZmF1Y2lidXMgY29tbW9kbyBpcHN1bSB2ZWwgZnJpbmdpbGxhLiBNb3JiaSB0ZW1w\r\ndXMgZWxpdCBhIG1pIHRlbXBvciwgYSBsdWN0dXMgdXJuYSB0ZW1wb3IuIFByYWVzZW50IGp1c3Rv\r\nIGRvbG9yLCBjb252YWxsaXMgbGFvcmVldCB0ZWxsdXMgc2VkLCBtb2xlc3RpZSBzb2RhbGVzIHRv\r\ncnRvci4gRHVpcyBhYyBtYXVyaXMgZXUgZXJvcyBlbGVtZW50dW0gaGVuZHJlcml0LiBTdXNwZW5k\r\naXNzZSBqdXN0byBuaXNpLCBzb2xsaWNpdHVkaW4gc2l0IGFtZXQgc3VzY2lwaXQgdml0YWUsIHZv\r\nbHV0cGF0IHJ1dHJ1bSBuaXNpLiBBbGlxdWFtIHF1aXMgYWNjdW1zYW4gbmVxdWUuIEV0aWFtIGxp\r\nYmVybyBtYWduYSwgcGxhY2VyYXQgZWdldCBkdWkgc2VkLCBsdWN0dXMgZGlnbmlzc2ltIG51bmMu\r\nIFV0IG1vbGxpcyBwdXJ1cyBwdXJ1cywgaW4gcHVsdmluYXIgcHVydXMgc29kYWxlcyBuZWMuIElu\r\ndGVnZXIgbmVjIGxpYmVybyBtb2xsaXMsIHNlbXBlciBlcm9zIGlkLCBzZW1wZXIgb2Rpby4gTW9y\r\nYmkgdGluY2lkdW50IHF1YW0gYW50ZSwgYSB2b2x1dHBhdCBuaWJoIGhlbmRyZXJpdCB2ZWwuIEZ1\r\nc2NlIGV1IHN1c2NpcGl0IGxvcmVtLiBOdWxsYW0gZXQgdHVycGlzIGF0IG9kaW8gZmV1Z2lhdCBp\r\nbXBlcmRpZXQuIE51bGxhIGlkIG5pYmggc2FwaWVuLiBEdWlzIGx1Y3R1cyBsZWN0dXMgdml0YWUg\r\ndGVsbHVzIGN1cnN1cyBtb2xsaXMuIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0\r\nZXR1ciBhZGlwaXNjaW5nIGVsaXQu');
  });
  base64.write('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus commodo ipsum vel fringilla. Morbi tempus elit a mi tempor, a luctus urna tempor. Praesent justo dolor, convallis laoreet tellus sed, molest');
  base64.write('ie sodales tortor. Duis ac mauris eu eros elementum hendrerit. Suspendisse justo nisi, sollicitudin sit amet suscipit vitae, volutpat rutrum nisi. Aliquam quis accumsan neque. Etiam libero magna, placerat eget dui sed, luctus dignissim nunc. Ut mollis purus purus, in pulvinar purus sodales nec. Integer nec libero mollis, semper eros id, semper odio. Morbi tincidunt quam ante, a volutpat nibh ');
  base64.write('hendrerit vel. Fusce eu suscipit lorem. Nullam et turpis at odio feugiat imperdiet. Nulla id nibh sapien. Duis luctus lectus vitae tellus cursus mollis. Lorem ipsum dolor sit amet, consectetur');
  base64.write(' adipiscing elit.');
  base64.end();
});

test('One fancy UTF-8 character', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'w6k=');
  });
  base64.end('é');
});

test('Two fancy UTF-8 characters', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'w6nDqQ==');
  });
  base64.end('éé');
});

test('Three fancy UTF-8 characters', function (t) {
  t.plan(1);
  base64 = mimeBase64Stream();
  streamed(base64, function (output) {
    t.equal(output, 'w6nDqcOp');
  });
  base64.end('ééé');
});
