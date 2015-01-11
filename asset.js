module.exports = (function () {
    var config = require("./config");
    var Client = require('node-rest-client').Client;
    var bitcoinjs = require('bitcoinjs-lib');
    var base58check = require('bs58check');
    var _ = require('lodash');


    function assetManager() {  };

    function getP2SHVersion(base58Address) {
        var testkey = bitcoinjs.Address.fromBase58Check(base58Address);
        var version = _.find(bitcoinjs.networks, function (network) {
            return (testkey.version == network.scriptHash) || (testkey.version == network.pubKeyHash);
        });
        //console.log(version.scriptHash);
        return version ? version.scriptHash : testkey.version;
    }

    assetManager.getAssetAddressId = function getAssetAddressId(base58Address) {
        var addresshash = bitcoinjs.Address.fromBase58Check(base58Address).hash;
        var scriptP2PKH = bitcoinjs.scripts.pubKeyHashOutput(addresshash).getHash();
        var scriptP2SH = new Buffer(scriptP2PKH.length + 1);
        scriptP2PKH.copy(scriptP2SH, 1);
        scriptP2SH[0] = getP2SHVersion(base58Address);
        return base58check.encode(scriptP2SH);
    }

    return assetManager;
})();