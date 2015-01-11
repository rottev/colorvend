var express = require('express');
var config = require("./config");
//var redis = require('redis');
var monitor = require('./monitor');
var vending = require('./vending');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib = require('nib');



var app = express();


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(bodyParser());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
//app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))


app.get('/', function(req, res){
   res.render('index',
        { title : 'Home', assets: vending.addPricesToAssetList(config.assets) }
  );
});

app.get('/price/:assetadder', function (req, res) {
    return res.json(vending.getCurrentPriceForAsset(req.params.assetadder));
});

//star mointoring bitcoin network
monitor.init();
// init vending machine and adresses
vending.init();
vending.events.on('colorUp', function (adder) {

        monitor.getAdressEmiiter(adder).on('data', vending.gotPaymentToAdress);
     //   monitor.getAdressEmiiter("kaka").events.on('data', vending.gotPaymentToAdress);
   
});

app.listen(8080);