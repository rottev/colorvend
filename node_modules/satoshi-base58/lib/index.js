var bn = require('bignum');
var hash = require('satoshi-hash');

var base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var base58Values = {};
for (var i = 0; i < base58Chars.length; i++) {
  base58Values[base58Chars[i]] = i;
}

function encode(buf) {
  var n = bn.fromBuffer(buf, { endian: 'little' });
  var chars = [];
  var r;
  while (n.gt(0)) {
    r = n.mod(58);
    n = n.div(58);
    chars.push(base58Chars[r.toNumber()]);
  }
  for (var i = 0; i < buf.length && buf[i] === 0; i++) {
    chars.push(base58Chars[0]);
  }
  return chars.reverse().join('');
}

function decode(str) {
  var n = bn(0);
  for (var i = 0; i < str.length; i++) {
    n = n.mul(58);
    n = n.add(base58Values[str[i]]);
  }
  for (var i = 0; i < str.length && str[i] === '1'; i++) {}
  var zeroBuf = new Buffer(new Array(i));
  if (n.eq(0)) {
    return zeroBuf;
  } else {
    var buf = n.toBuffer();
    return Buffer.concat([zeroBuf, buf], i + buf.length);
  }
}

function encodeCheck(buf) {
  var hash256 = hash.hash256(buf);
  return encode(Buffer.concat([buf, hash256.slice(0, 4)], buf.length + 4));
}

function decodeCheck(str) {
  var buf = decode(str);
  if (buf.length < 4) {
    return false;
  }
  var data = buf.slice(0, -4);
  var checksum = buf.slice(-4);
  var hash256 = hash.hash256(data);
  for (var i = 0; i < 4; i++) {
    if (checksum[i] !== hash256[i]) {
      return false;
    }
  }
  return data;
}

exports.encode = encode;
exports.decode = decode;
exports.encodeCheck = encodeCheck;
exports.decodeCheck = decodeCheck;
