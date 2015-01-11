module.exports = (function () {
    var config = require("./config");
    var Client = require('node-rest-client').Client;
    var Q = require("q");

    var client = new Client();

    function colorapi() {
        console.log("registering methods");
        client.registerMethod("getAssetDefinition", config.apiurl + "assets/${asset_address}", "GET");
        client.registerMethod("issueColoredCoins", config.apiurl + "issueasset", "POST");
        client.registerMethod("broadcastTransaction", config.apiurl + "sendrawtransaction", "POST");
        client.registerMethod("getTransaction", config.apiurl + "transactions/${transaction_hash}", "GET");
        client.registerMethod("getRawTxInfo", config.apiurl + "analyzerawtransactions", "POST");
    }

    colorapi.getAssetDefeintion = function getAssetDefeintion(asset_address) {
        var deferred = Q.defer();
        var args = {
            path: { "asset_address": asset_address }
        };
        client.methods.getAssetDefinition(args, function (data, response) {
            console.log(data);
            if (response.statusCode == 200) {
                deferred.resolve(data);
            }
            else {
                deferred.reject(new Error("Status code was " + response.statusCode));
            }
        }).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
            deferred.reject(new Error("Status code was " + err.request.options));
        });

        return deferred.promise;
    }

     colorapi.getTransaction = function getTransaction(txhash) {
        var deferred = Q.defer();
        var args = {
            path: { "transaction_hash": txhash }
        };
        client.methods.getTransaction(args, function (data, response) {
            console.log(data);
            if (response.statusCode == 200) {
                deferred.resolve(data);
            }
            else {
                deferred.reject(new Error("Status code was " + response.statusCode));
            }
        }).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
            deferred.reject(new Error("Status code was " + err.request.options));
        });

        return deferred.promise;
    }

     colorapi.getRawTransaction = function getRawTransaction(txhasharray) {
        var deferred = Q.defer();
        var args = {
            data: txhasharray
        };
        client.methods.getTransaction(args, function (data, response) {
            console.log(data);
            if (response.statusCode == 200) {
                deferred.resolve(data);
            }
            else {
                deferred.reject(new Error("Status code was " + response.statusCode));
            }
        }).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
            deferred.reject(new Error("Status code was " + err.request.options));
        });

        return deferred.promise;
    }

    colorapi.createAsset = function createAsset(asset) {
        var deferred = Q.defer();
        var args = {
            data: {
                "fees": asset.fees,
                "from": asset.issueaddr,
                "address": asset.assetaddr,
                "amount": asset.amount,
                "metadata": "u=" + asset.metadataurl
            },
            parameters: { "format": "raw" },
            headers: { "Content-Type": "application/json" }
        };

        client.methods.issueColoredCoins(args, function (data, response) {
            console.log(data);
            if (response.statusCode == 200) {
                deferred.resolve({ transaction: data, asset: asset });
            }
            else {
                deferred.reject(new Error("Status code was " + response.statusCode));
            }
        }).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
            deferred.reject(new Error("Status code was " + err.request.options));
        });

        return deferred.promise;
    }

    colorapi.broadcastRawTx = function broadcastRawTx(rawTx, asset) {
        var deferred = Q.defer();
        var args = {
            data: '"'+ rawTx +'"',
            headers: { "Content-Type": "application/json" }
        };

        console.log(rawTx);
        client.methods.broadcastTransaction(args, function (data, response) {
            console.log(data);
            if (response.statusCode == 200) {
                deferred.resolve({ txHash: data, asset: asset });
            }
            else {
                deferred.reject(new Error("Status code was " + response.statusCode));
            }
        }).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
            deferred.reject(new Error("Status code was " + err.request.options));
        });

        return deferred.promise;
    }

    colorapi();

    return colorapi;
})();