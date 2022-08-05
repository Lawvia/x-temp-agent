const express = require('express')
const router = express.Router()
const c_panels = require('./panels/controller_panel')
const model_migration = require('../models/model_migration')
const GoogleReceiptVerify = require('google-play-billing-validator')
// const asembelKey = require("./../config/asembel-key.json")
// const asembelmir = require("./../config/asembel-mir.json")
// const ServiceAccount = require('./service-account-key')
// var iap = require('in-app-purchase');

// iap.config({

//     /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
//     googleServiceAccount: {
//         clientEmail: 'nagih-dev-billing@assemble-55199350.iam.gserviceaccount.com',
//         privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDoS8lR4RzqU/4h\nOxHP2EYQo3fcj1RJdPZ8Z9UGZTDVuepKc33MiWMuC2KQM45EVOgq/pq83YOno4im\nIdIur8lDlzsEkK1zHBcAUvACG0aEzJh2Gt9WR+GyeoIPKn1cCxKRNJn55iBICsJK\nYV/u1X9PtGGDpw7bmJNLQmEYRWUnpw0Mz4biSoTTafsh3vqI41TbN9u7tCHYYIHM\nBVPfKxXCOV+zpZ/kZWF2VhJWSX5YnpC+Uzt4c/0WBfxkxzq7sAcQ/nnwRVQx4qJx\nimt9RZ2Xmz9EK/NR7l1KL4RsoudB6bG8huttyUwqb9PfJrZLTqqMtrOMP6pgC/al\nzydlwteHAgMBAAECggEATyaHlc0g950f8b25T3svQHsam74Ap7jhRblxZejzz1c2\nRCD/A8LqVuWNM3pFpvXRV9kB64mE0wmPRaAviDXgW5X7h44uc5LmKXeZDPazPAuk\nhVWZtMHwXsqMZ1OAfGzPakekkXg+lp2H3yU3tV7srsFVGrFBCEUAJzwablUy5uPH\n6VGv0iLSy0eTqLMfIez32NN4B5+nDULvpaWFWrARkDRx1H4nKzPLb5ehkrx52rcq\n9cdpBURsiNK6xvKF18K2JZhsVoWVfBhs4ZHmTcD8YQpxqzh6pe9PkRiisIcrTX7q\n553nqY//dJQtByUysNED5H7Ki2EqsHaNs5+5o+FSxQKBgQD9cbNotghhdLBIWfdq\njHZLceXjoBSwvs37Kqx4xx5bN7odVBF+NZ64oQ8RWJzDYrFp/q/U05RkbzJWiGrQ\nmrZ5myilDuR2zyMXje/3TJ4ini9RmDy0tXSHLl0wlOfpPAKmxpc2yJuwJH94zoQP\naIS++IVpGkEDZCDEjApNcI5aGwKBgQDqo30u4kdSHSboDqtiI/EQ7yqIv/n0dP5I\nvXppT1kPTcEXeapdSswzabbbi3lgKw6Cj00c13K3x5r9r3+VTiSVlEEry+DWw10A\ntjsUUzz7krAOsTNcOtYYEZTwgoB8qmBCkqXJksmwFC58Al2a8iGSmY4/UUAvrlUW\njOAgllKPBQKBgBXWiT35iWlUU6g4UFBXAA5qJwPhFEdSeY8t0ySpC52ShK/oQYWd\neyqvfgvhlchkJaNbda0h+gRZbH32TTXiTtzVmL/4M4llOcHa0hV9/ZZACRW/x2NO\ny1amkRMRkZYQPK5AKGFpEbkwu+cd7FUjjWSjJ2OyBm4TX5tv8adQjoOHAoGAN7n+\niD0LrU/pJqIdSCC7J0d2NaZKqimDHymJQiurPjw8SOQHd0LFfsxztm7Is/Nl7dI1\nAU2WHFnW0Lt2tLIrdC8Sz2ELlFYv53RgUbJ3QFSVZdfmF9iNcofydLC57WHVnNoR\nb+9h4WTZqXAyZRNur8+yfg1BDlH8OW/Z50NsdjUCgYBtAeoGUfaHQcGXShbOiouJ\n0hbYStmiYmy51IOsRX0cTbIXiXFmnQsGZT7nKKbpjY17TAbKe3wM/iWzsNLzpido\nZfhCYHZv5JyPMuVloaA9PF6zL78RM/naamUEkLTWT4omdyh7wwtdTynXMFoOfEIq\nS7CvAUakk6hlgWDms/EG/w==\n-----END PRIVATE KEY-----\n'
//     },

//     /* Configurations all platforms */
//     test: true, // For Apple and Googl Play to force Sandbox validation only
//     verbose: true // Output debug logs to stdout stream
// });

// var receipt = {
//     packageName: 'com.hit.monkeylandbattleground',
//     productId: 'com.hit.monkeylandbattleground.db50',
//     purchaseToken: 'npmaghpgiogmmnnbghkpgdmn.AO-J1OzAQ1u1aIIT4IDj8VZNIF0OlhVc_9cDBcsc7FACDTf3WKzU3aCF_eouK98Df0yKOiF23Sd-dkHwIeYNMv1ee1fDx8ONeCTnft-A1MNaeld-3gUKOfE',
//     subscription: false // if the receipt is a subscription, then true
// }

// iap.setup()
//   .then(() => {
//     // iap.validate(...) automatically detects what type of receipt you are trying to validate
//     iap.validate(receipt).then(onSuccess).catch(onError);
//   })
//   .catch((error) => {
//     // error...
//     console.log("err setup", error)
//   });

function onSuccess(validatedData) {
    console.log("suks", validatedData)
    // validatedData: the actual content of the validated receipt
    // validatedData also contains the original receipt
    var options = {
        ignoreCanceled: true, // Apple ONLY (for now...): purchaseData will NOT contain cancceled items
        ignoreExpired: true // purchaseData will NOT contain exipired subscription items
    };
    // validatedData contains sandbox: true/false for Apple and Amazon
    var purchaseData = iap.getPurchaseData(validatedData, options);
    console.log("purc", purchaseData)
}

function onError(error) {
    // failed to validate the receipt...
    console.log("err b", error)
}


router.get('/app-status', async (req, res) => {


var googleReceiptVerify = new GoogleReceiptVerify({
    email: asembelmir.client_email,
    key: asembelmir.private_key
  });

  // let responseG = await googleReceiptVerify.verifyINAPP({
  //   packageName: "com.hit.monkeylandbattleground",
  //   productId: "com.hit.monkeylandbattleground.db50",
  //   purchaseToken: "npmaghpgiogmmnnbghkpgdmn.AO-J1OzAQ1u1aIIT4IDj8VZNIF0OlhVc_9cDBcsc7FACDTf3WKzU3aCF_eouK98Df0yKOiF23Sd-dkHwIeYNMv1ee1fDx8ONeCTnft-A1MNaeld-3gUKOfE",
  // });

  // console.log("response gugel ", responseG)

  

let promiseData = googleReceiptVerify.verifyINAPP({
        packageName: "com.hit.monkeylandbattleground",
        productId: "com.hit.monkeylandbattleground.db50",
        purchaseToken: "gemapmlpklklhlgpokcnikpg.AO-J1Oz7dfQmEUrjoGe42-yVxX7vWOITmfPbJY7M1ogIddarTCGIgc_nv-MCz00deJPgPEitr2wsbWc3jvNO5TqgKGMfr_XbTaaqE6d_9SdVkMS2BP-osZk",
      })

promiseData.then(function(response) {
  // Yay! Purchase is valid
  // See response structure below
  console.log("sukses", response)
  

})
.then(function(response) {
    console.log("tes", response)
  // Here for example you can chain your work if purchase is valid
  // eg. add coins to the user profile, etc
  // If you are new to promises API
  // Awesome docs: https://developers.google.com/web/fundamentals/primers/promises

  var verifier = new GoogleReceiptVerify({
    email: asembelmir.client_email,
    key: asembelmir.private_key
  });

  let receipt = {
    packageName: "com.hit.monkeylandbattleground",
    productId: "com.hit.monkeylandbattleground.db50",
    purchaseToken: "gemapmlpklklhlgpokcnikpg.AO-J1Oz7dfQmEUrjoGe42-yVxX7vWOITmfPbJY7M1ogIddarTCGIgc_nv-MCz00deJPgPEitr2wsbWc3jvNO5TqgKGMfr_XbTaaqE6d_9SdVkMS2BP-osZk",
    developerPayload: "Acknowledged Purchase Successfully"
  };

  let promise3 = verifier.verifyINAPP(receipt)
  promise3.then(function(response){
    console.log("adad", response)
  })
  .catch(function(error){
    console.log("ack", error)
  })
})
.catch(function(error) {
    console.log("rrr", error)
  // Purchase is not valid or API error
  // See possible error messages below
})


    var status = ""    
    var version = ""
    var updated = ""
    try {
        var [data, err] = await model_migration.get()
        status = 'OK';
        version = "updated"
        updated = "is ok"
    } catch (error) {
        status = error;
    }
    var response = {
        "server_date":     Date(),
        "db_status":       status,
        "db_version":      version,
        "db_last_updated": updated,
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(response))
})

router.get('/', function(req, res){
    res.redirect("/panels")
})

router.use("/panels", c_panels)
// router.use("/api", c_api)
// router.use("/docs", c_docs)

router.use(function(req, res){
    res.status(404).render("pages/page_404",{})
    return
});

module.exports = router