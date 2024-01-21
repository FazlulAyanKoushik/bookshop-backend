const bkash = require('../config/bkash');

exports.createPayment = async (req, res, next) => {

    try {
        /**
         * BODY FORMAT
         const paymentRequest = {
            amount: 1000,
            orderID: 'ORD1020069',
            intent: 'sale',
        };
         */

        const result = await bkash.createPayment(req.body);

        res.status(200).json({
            data: result,
            message: 'Success',
            success: true,
        })


    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.executePayment = async (req, res, next) => {
    try {
        const { paymentID } = req.body;

        const result = await bkash.executePayment(paymentID)

        res.status(200).json({
            data: result,
            message: 'Success',
            success: true,
        })


    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.queryPayment = async (req, res, next) => {

    try {
        const { paymentID } = req.params;

        const result = await bkash.queryPayment(paymentID)


        res.status(200).json({
            data: result,
            message: 'Success',
            success: true,
        })


    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}