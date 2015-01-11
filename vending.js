module.exports = (function () {
    var yahoof = require("yahoo-finance");
    var config = require("./config");
    var _ = require('lodash');
    var am = require("./adressManager");
    var api = require('./colorapi');
    var EventEmitter = require("events").EventEmitter;

    var rawPrices = {};
    vending.init = function init() {
        var symbols = _.map(config.assets, "yahoosymbol");
        var symbolse = _.map(config.assets, "etoro");
        setInterval(getPrices, 1000, { yahoo: symbols, etoro: { symbols: symbolse }});
        am.init(function (address) {
            vending.events.emit('colorUp', address);
        });
    }

    function vending() { }

    var getPrices = function getPrices(args) {
        getPricesForAssetsWithYahoo(args.yahoo);
        getProcesForAssetsEtoro(args.etoro);
    }

    function getPricesForAssetsWithYahoo(symbolsyahoo) {
        yahoof.snapshot({
            symbols: symbolsyahoo,
            fields: ['s', 'n', 'd1', 'l1', 'y', 'r', 'a', 'b', 'b2', 'b3', 'p', 'o']
        })
        .then(function (data) {
            // console.log(data);
            _.forEach(data, function (single) {
                //rawPrices
                var asset = _.find(config.assets, function (ast) {
                    return ast.yahoosymbol.toUpperCase() === single.symbol.toUpperCase();
                });

                if (asset) {

                    rawPrices[asset.assetaddr] = { bid: single.bid, ask: single.ask };
                    //console.log(rawPrices[asset.assetaddr]);
                }
            });

        });
    }

    function getProcesForAssetsEtoro(etoroconfig)
    {
        
    }
    //init();


    vending.gotPaymentToAdress = function gotPaymentToAdress(data) {
        console.log('gotPaymentToAdress: ' + data.address);
        console.log('gotPaymentToAdress: ' + data.tx.hash);
        // tx: tx, txobj: info.message.tx, addresses: reciving , address: adder

        //check if its btc or color and send the other to the same adress.
        // right now coinprisem api doesnt know about unconfimed transactions, or tx's broadcast through the api
        // therefore we can assume this tx is not colored if get transaction fails
        api.getTransaction(data.tx.hash)
        .then(function (txdata) {
            console.log(txdata);
        }, function (reason) {

        });
    }

    vending.events = new EventEmitter();

    vending.addPricesToAssetList = function addPricesToAssetList(assets) {
        _.forEach(assets, function (asset) {
            asset.buy = rawPrices[asset.assetaddr].bid;
            asset.sell = rawPrices[asset.assetaddr].ask;
        });
        return assets;
    }

    vending.getCurrentPriceForAsset = function getCurrentPriceForAsset(assetadder) {
        return { bid: rawPrices[assetadder].bid, ask: rawPrices[assetadder].ask };
    }

    return vending;

})();