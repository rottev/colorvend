module.exports = (function () {
    var config = require("./config");
    var bitcore = require('bitcore');
    var bitcoinjs = require('bitcoinjs-lib');
    var networks = bitcore.networks;
    var Peer = bitcore.Peer;
    var PeerManager = bitcore.PeerManager;
    var EventEmitter = require("events").EventEmitter;
    var _ = require('lodash');
    var base58check = require('bs58check');

    var trackingAdresses = {};
    var net = config.testnet ? 'testnet' : 'livenet';
    /*
    var PeerManager = require('soop').load('./node_modules/bitcore/lib/PeerManager', {
    network: networks.testnet
    });
    */


    function exitHandler(options, err) {

        if (options.cleanup) console.log('clean');
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
    }

    //do something when app is closing
    //  process.on('exit', exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    //  process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    //  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

    var handleBlock = function (info) {
        try {
            console.log('** Block Received **');
            //console.log(info.message);
            _.forEach(info.message.block.txs, function (txo) {
                var tx = txo.getStandardizedObject();
                var reciving = txo.getReceivingAddresses(net);
                _.forEach(reciving, function (adder) {
                    var base58address = base58check.encode(new Buffer(adder, 'hex'));

                    if (trackingAdresses[base58address]) {
                        var index = _.findIndex(reciving, function (haystack) { return haystack === adder});
                        trackingAdresses[base58address].emit('data', { tx: tx, txobj: txo, outindex: index, address: base58address });
                    }
                });
            });
        }
        catch (e) {
            console.log('** Block Received Exception**');
            console.log(e.stack);
        }
    };

    var handleTx = function (info) {
        try {
            var tx = info.message.tx.getStandardizedObject();

            console.log('** TX Received **');

            var reciving = info.message.tx.getReceivingAddresses(net);
            console.log(reciving);
            _.forEach(reciving, function (adder) {
                var base58address = base58check.encode(new Buffer(adder, 'hex'));

                if (trackingAdresses[base58address]) {
                     var index = _.findIndex(reciving, function (haystack) { return haystack === adder});
                    trackingAdresses[base58address].emit('data', { tx: tx, txobj: info.message.tx, outindex: index, address: base58address });
                }
               
            });


            /*
            
            _.forIn(trackingAdresses, function (adder) {
            adder.emit('data', tx);
            });
            */
            //console.log(tx);
        }
        catch (e) {
            console.log('** TX Received Exception**');
            console.log(e.stack);
        }
    };

    var handleInv = function (info) {

        try {
            //    console.log('** Inv **');
            //   console.log(info.message);
            var invs = info.message.invs;
            info.conn.sendGetData(invs);
        }
        catch (e) {
            console.log('** Inv Exception**');
            console.log(e);
        }
    };



    function monitor() { };

    monitor.init = function init() {
        var peerman = new PeerManager({ network: config.testnet ? 'testnet' : 'livenet' });
        // peerman.discover({ options: { limit: 40} }, null);
        //  peerman.peerDiscovery = true;
        peerman.addPeer(new Peer('127.0.0.1', 18333));

        peerman.on('connection', function (conn) {
            conn.on('inv', handleInv);
            conn.on('block', handleBlock);
            conn.on('tx', handleTx);
        });

        peerman.start();
    }

    monitor.getAdressEmiiter = function getAdressEmiiter(adress) {
        if (!trackingAdresses[adress])
            trackingAdresses[adress] = new EventEmitter();
        return trackingAdresses[adress];
    }

    return monitor;


})();


