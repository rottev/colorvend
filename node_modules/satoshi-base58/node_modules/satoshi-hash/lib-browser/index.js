var sjcl = require('satoshi-sjcl');
var hkdf = require('../lib/hkdf');

var toBits = sjcl.codec.bytes.toBits;
var toBytes = sjcl.codec.bytes.fromBits;

var ripemd160 = sjcl.hash.ripemd160.hash;
var sha256 = sjcl.hash.sha256.hash;
var sha512 = sjcl.hash.sha512.hash;

function wrap(fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
      if (Buffer.isBuffer(args[i])) {
        args[i] = toBits(args[i]);
      }
    }
    return new Buffer(toBytes(fn.apply(null, args)));
  }
}

function hash160(data) {
  return ripemd160(sha256(data));
}

function hash256(data) {
  return sha256(sha256(data));
}

function hmacsha256(key, data) {
  return new sjcl.misc.hmac(key, sjcl.hash.sha256).encrypt(data);
}

function hmacsha512(key, data) {
  return new sjcl.misc.hmac(key, sjcl.hash.sha512).encrypt(data);
}

exports.ripemd160 = wrap(ripemd160);
exports.sha256 = wrap(sha256);
exports.sha512 = wrap(sha512);
exports.hash160 = wrap(hash160);
exports.hash256 = wrap(hash256);
exports.hmacsha256 = wrap(hmacsha256);
exports.hmacsha512 = wrap(hmacsha512);
exports.hkdf256 = hkdf(wrap(hmacsha256), 32);
