module.exports = (function () {
    var bitcore = require('bitcore');
    var bitcoinjs = require('bitcoinjs-lib');
    var config = require('./config');
    var api = require('./colorapi');
    var _ = require('lodash');
    var buffertools = bitcore.buffertools;
    var assetManager = require('./asset');
    var Q = require("q");
    var redis = require('redis')
    , jsonify = require('redis-jsonify')
    , client = jsonify(redis.createClient());

    //signRawTransaction

    var trySignTransaction = function trySignTransaction(data) {
        var deferred = Q.defer();
        try {
            transactionObj = JSON.parse(data.transaction);
            console.log("tx ok:  " + data.transaction);
            var raw = new Buffer(transactionObj.raw, 'hex');
            var tx = new bitcore.Transaction();
            tx.parse(raw);

            var opts =
      {
          remainderOut: { address: data.asset.issueaddr },
          fee: 0,
          amount: 0,
          lockTime: null,
          spendUnconfirmed: false,
          signhash: bitcore.Transaction.SIGHASH_ALL
      }
            console.log("tx");
            console.log(tx.ins[0].o);
            //   console.log("tx.ins");
            // console.log(tx.ins);
            // console.log("tx.outs");
            //  console.log(tx.outs);


            var txbuilder = new bitcore.TransactionBuilder(opts);
            txbuilder.tx = tx;

            console.log("isFullySigned: " + txbuilder.isFullySigned());

            console.log(buffertools.toHex(tx.serialize()));

            console.log(txbuilder.toObj());

            var keys = ["dsfsdfs"];

            console.log(keys);
            //  console.log(txbuilder.tx);

            // config.assets.findKey({ 'age': 1 });

            //   var info = bitcore.TransactionBuilder.infoForP2sh({ address: data.asset.issueaddr }, 'testnet');
            console.log("after set infoForP2sh");
            // var hashMap = {};
            // hashMap[info.address] = info.scriptBufHex;
            txbuilder.tx = txbuilder.build();
            console.log("before set script");
            //  txbuilder.setHashToScriptMap(hashMap);

            console.log("before sign");

            txbuilder.sign(['L3nsAafxeMqi3tAs2fVijDZeG2grsFJmgKeMjAUrmxYUznZ8yfSx']);

            console.log("after sign");

            // console.log("isFullySigned: " + txbuilder.isFullySigned());
            //  console.log("_checkTx: " + txbuilder._checkTx());

        }
        catch (e) {
            console.log("trySignTransaction exeption " + e);
            console.log("trySignTransaction exeption " + e.stack);
            deferred.reject(new Error("exeption " + e));
        }

        return deferred.promise;
    }

    var trySignTransactionBitcoinjs = function trySignTransactionBitcoinjs(data) {
        var deferred = Q.defer();
        try {
            transactionObj = JSON.parse(data.transaction);
            console.log("tx ok:  " + data.transaction);

            var tx = bitcoinjs.Transaction.fromHex(transactionObj.raw);

            console.log(tx);
            var txorig = tx.clone();
            tx.ins.forEach(function (input) {
                input.script = bitcoinjs.Script.EMPTY;
            });
            console.log(tx);
            // var txbuilder = bitcoinjs.TransactionBuilder.fromTransaction(tx);

            key = bitcoinjs.ECKey.fromWIF(data.asset.issuekey);

            // Sign the first input with the new key
            tx.sign(0, key)

            console.log(tx);
            data.transactionHex = tx.toHex();
            deferred.resolve(data);

        }
        catch (e) {
            console.log("trySignTransactionbitcoinjs exeption " + e);
            console.log("trySignTransactionbitcoinjs exeption " + e.stack);
            deferred.reject(new Error("exeption " + e));
        }

        return deferred.promise;
    }

    var tryBrodcastTransaction = function tryBrodcastTransaction(data) {
        return api.broadcastRawTx(data.transactionHex, data.asset);
    }



    function getAssetFromApi(asset_address) {
        return api.getAssetDefeintion(asset_address);
    }

    function tryCreateAsset(asset) {
        return api.createAsset(asset);
    }

    var trySaveTransaction = function trySaveTransaction(data) {
        var deferred = Q.defer();
        
        client.hmset('asset', data.asset.name, data.asset, function (err, data) {
            console.log(data);
            deferred.resolve(data);
        });
          return deferred.promise;
    }

    function addressManager() { }

    addressManager.init = function init(callback) {
        config.assets.forEach(function (asset) {
            console.log("cheking for asset: " + asset.name);
            client.select(config.testnet ? 2 : 3, function () {

                var assetAdressId = assetManager.getAssetAddressId(asset.issueaddr);
                console.log(assetAdressId);

                client.hexists('asset', asset.name, function (err, data) {
                    if (data === 1) {
                        console.log("asset should exist");
                        getAssetFromApi(assetAdressId)
                        .then(function (assetdata) {
                            console.log("api asset:");
                            console.log(assetdata);
                            callback(asset.assetaddr);
                        });

                        return;
                    }
                    else {
                        //try and create the asset
                        tryCreateAsset(asset)
                        .then(trySignTransactionBitcoinjs)
                        .then(tryBrodcastTransaction)
                        .then(trySaveTransaction)
                        .then(function (data) {
                            callback(asset.assetaddr);
                        });


                        //  client.hmset('asset', assetin.id, assetin, function (err, data) {
                        //    next(err, { key: key });
                        // });

                        // client.hmset('asset-key', assetin.id, key, function (err, data) { });
                    }
                });
            });
        });
    }

    return addressManager;

})();