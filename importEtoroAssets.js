var Client = require('node-rest-client').Client;
var Q = require("q");
var _ = require('lodash');
var fs = require('fs'),
    request = require('request');

function donwnloadImage (uri, filename){
  var deferred = Q.defer();
  try
  {
      request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream("./public/images/" + filename)).on('close',  function() {deferred.resolve()});

      });
  }
  catch(e)
  {
      console.log(e.stack);
  }
  return deferred.promise;
};




var client = new Client();
var baseurl = "http://fapi-real.etoro.com"
client.registerMethod("getAllInstruments", baseurl + "/instruments.json", "GET");
client.registerMethod("getAllRates", baseurl + "rates", "GET");

var newconfig = {};
getInstruments()
.then(function (instruments) {
    _.forEach(instruments, function (instrument) {

        createAssetFromInstrument(instrument);

    }, function (error) {
        console.log("error: " + error);
    });
});



function createAssetFromInstrument(instrument) {
    var deferred = Q.defer();

    _.forEeach(instrument.Images, function (image) {
        var localname = instrument.Symbol + "_" + image.Height + ".png";
        donwnloadImage(image.Uri,localname)
        .then(function () {
            console.log("downloaded: " + localname);
        })
    });

    var asset = {
          name: instrument.Symbol + " Coin",
       etoro: instrument.Symbol,
       id:"",
       ticker: "",
       fees: 1000,
  //     issueaddr:"mxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg",
  //     issuekey:"L3nsAafxeMqi3tAs2fVijDZeG2grsFJmgKeMjAUrmxYUznZ8yfSx",
  //     assetaddr:"mm9hHVPUFiHnGFCmiW5bVkXF6PxBokhkuW",
  //     assetkey:"L2NpKdBSa7H4NzY5PkEtHBrP8HdWgeZ7U3d8ec29V5MfEPy5YBVA",
       amount: "1000000000000",
       metadataurl:"http://goo.gl/KaqliK",
       metadata: {
          source_addresses: [
            "2MwRUYSG9jWNqZjCsNrdnHHXs8fVLnCHP9u"
          ],
          contract_url: "http://goo.gl/KaqliK",
          name_short: "EURCoin",
          name: "Euro Coins",
          issuer: "colorcoins.org",
          description: "Coins that are backed up by the Euro",
          description_mime: "text/x-markdown; charset=UTF-8",
          type: "CryptoToken",
          divisibility: 4,
          link_to_website: true,
          icon_url: null,
          image_url: null,
          version: "1.0"
        }
    }

   

    return deferred.promise;
}

function getInstruments() {
      var deferred = Q.defer();
        var args = {
           // headers: { "Content-Type": "application/json" }
            //path: { "asset_address": asset_address }
        };
        client.methods.getAllInstruments(args, function (data, response) {
            if (response.statusCode == 200) {
                deferred.resolve(JSON.parse(data));
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
