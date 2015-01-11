var base58 = require('../');

var testData = [
  ["61", "2g", "C2dGTwc"],
  ["626262", "a3gV", "4jF5uERJAK"],
  ["636363", "aPEr", "4mT4krqUYJ"],
  ["73696d706c792061206c6f6e6720737472696e67", "2cFupjhnEsSn59qHXstmK2ffpLv2", "BXF1HuEUCqeVzZdrKeJjG74rjeXxqJ7dW"],
  ["00eb15231dfceb60925886b67d065299925915aeb172c06647", "1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L", "13REmUhe2ckUKy1FvM7AMCdtyYq831yxM3QeyEu4"],
  ["516b6fcd0f", "ABnLTmg", "237LSrY9NUUas"],
  ["bf4f89001e670274dd", "3SEo3LWLoPntC", "GwDDDeduj1jpykc27e"],
  ["572e4794", "3EFU7m", "FamExfqCeza"],
  ["ecac89cad93923c02321", "EJDM8drfXA6uyA", "2W1Yd5Zu6WGyKVtHGMrH"],
  ["10c8511e", "Rt5zm", "3op3iuGMmhs"],
  ["00000000000000000000", "1111111111", "111111111146Momb"],
  ["", "", "3QJmnh"]
];

describe('satoshi-base58', function () {
  testData.forEach(function (data) {
    it('should correctly encode ' + (data[0] || 'empty'), function () {
      var buffer = new Buffer(data[0], 'hex');
      expect(base58.encode(buffer)).to.equal(data[1]);
    });

    it('should correctly check encode ' + (data[0] || 'empty'), function () {
      var buffer = new Buffer(data[0], 'hex');
      expect(base58.encodeCheck(buffer)).to.equal(data[2]);
    });

    it('should correctly decode ' + (data[1] || 'empty'), function () {
      expect(base58.decode(data[1]).toString('hex')).to.equal(data[0]);
    });

    it('should correctly check decode ' + (data[2] || 'empty'), function () {
      expect(base58.decodeCheck(data[2]).toString('hex')).to.equal(data[0]);
    });
  });

  it('should return false if failed check decode', function () {
    // too short
    expect(base58.decodeCheck('123')).to.be.false;
    // checksum mismatch
    expect(base58.decodeCheck('123123123123123')).to.be.false;
    expect(base58.decodeCheck('C2dGTwd')).to.be.false;
  });
});
