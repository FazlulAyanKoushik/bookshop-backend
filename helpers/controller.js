const request = require('request');
const fetch = require("node-fetch");
const BkashToken = require("../models/bkash-token");

exports.sendBulkSms = (phoneNo, message) => {
    const url = 'http://66.45.237.70/api.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message;
    console.log(url)
    // const url = 'http://66.45.237.70/maskingapi.php?username=' + process.env.bulkSmsUsername + '&password=' + process.env.bulkSmsPassword + '&number=' + phoneNo + '&message=' + message + '&senderid=' + process.env.bulkSmsSenderId;

    let result = '';
    let options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request(options, function (error, response) {
        if (error) {
            // console.log(error)
            result = error;
        }
        if (response.body) {
            result = response.body;
        }
        // console.log(response)
    });
}

exports.addToken = async (req, res, next) => {
    
    const url =
        "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant";
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            username: "sandboxTestUser",
            password: "hWD@8vtzw0",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            app_key: "5tunt4masn6pv2hnvte1sb5n3j",
            app_secret: "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka",
        }),
    };

    let bkashToken;
    
    fetch(url, options)
        .then((res) => res.json())
        .then(async (json) => {
            bkashToken = new BkashToken(json);
            await bkashToken.save();
            res.status(200).json({
                data: bkashToken,
                message: "token get Successfully!",
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                err.message = "Something went wrong on database operation!";
            }
            // next(err);
        });
}
