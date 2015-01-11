module.exports = function (hmac, hashLength) {
  return {
    extract: function (salt, input) {
      if (typeof salt === 'string') {
        salt = new Buffer(salt);
      }
      if (typeof input === 'string') {
        input = new Buffer(input);
      }
      return hmac(salt, input);
    },
    expand: function (key, info, length) {
      if (typeof info === 'string') {
        info = new Buffer(info);
      }
      var prev = new Buffer(0);
      var output = new Buffer(0);
      var numBlocks = Math.ceil(length / hashLength);

      for (var i = 1; i <= numBlocks; i++) {
        prev = hmac(key, Buffer.concat([prev, info, new Buffer([i])]));
        output = Buffer.concat([output, prev])
      }

      return output.slice(0, length);
    }
  }
};
