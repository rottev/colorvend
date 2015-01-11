var BigInteger = require('bigi');
var inherits = require('inherits');

function BigNum(num) {
  if (!(this instanceof BigNum)) {
    return new BigNum(num);
  }
  if (num instanceof BigInteger) {
    var bn = new BigNum();
    Object.keys(num).forEach(function (key) {
      bn[key] = num[key];
    });
    return bn;
  }
  if (typeof num === 'number') {
    this.fromInt(num);
  } else {
    BigInteger.apply(this, arguments);
  }
}
inherits(BigNum, BigInteger);

BigNum.fromBuffer = function (buffer, options) {
  return new BigNum(BigInteger.fromBuffer(buffer));
};

BigNum.prototype.add = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return new BigNum(BigInteger.prototype.add.call(this, a));
};

BigNum.prototype.mul = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return new BigNum(this.multiply(a));
};

BigNum.prototype.eq = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return this.equals(a);
};

BigNum.prototype.gt = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return this.compareTo(a) > 0;
};

BigNum.prototype.mod = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return new BigNum(BigInteger.prototype.mod.call(this, a));
};

BigNum.prototype.div = function (a) {
  if (typeof a === 'number') {
    a = new BigNum(a);
  }
  return new BigNum(this.divide(a));
};

BigNum.prototype.toNumber = function () {
  return this.intValue();
};

module.exports = BigNum;
