var config = {
   testnet: true,
   apiurl:"https://testnet.api.coinprism.com/v1/",
   cannoical:[{id:100000, cancross:[1,2,3] }],
   assets: [{
       name: "EURtest",
       yahoosymbol:"eurusd=x",
       id:"",
       ticker: "",
       fees: 1000,
       issueaddr:"mxNTyQ3WdFMQE7SGVpSQGXnSDevGMLq7dg",
       issuekey:"L3nsAafxeMqi3tAs2fVijDZeG2grsFJmgKeMjAUrmxYUznZ8yfSx",
       assetaddr:"mm9hHVPUFiHnGFCmiW5bVkXF6PxBokhkuW",
       assetkey:"L2NpKdBSa7H4NzY5PkEtHBrP8HdWgeZ7U3d8ec29V5MfEPy5YBVA",
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
   }]
}

module.exports = config;