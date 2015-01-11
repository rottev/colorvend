var crypto = require('crypto');
var hkdf = require('./hkdf');

function ripemd160(data) {
  return crypto.createHash('ripemd160').update(data).digest();
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

function sha512(data) {
  return crypto.createHash('sha512').update(data).digest();
}

function hash160(data) {
  return ripemd160(sha256(data));
}

function hash256(data) {
  return sha256(sha256(data));
}

function hmacsha256(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function hmacsha512(key, data) {
  return crypto.createHmac('sha512', key).update(data).digest();
}

exports.ripemd160 = ripemd160;
exports.sha256 = sha256;
exports.sha512 = sha512;
exports.hash160 = hash160;
exports.hash256 = hash256;
exports.hmacsha256 = hmacsha256;
exports.hmacsha512 = hmacsha512;
exports.hkdf256 = hkdf(hmacsha256, 32);
