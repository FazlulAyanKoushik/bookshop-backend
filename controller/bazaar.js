// Require Main Modules..
const { validationResult } = require('express-validator');


// Require Post Schema from Model..
const Bazaar = require('../models/bazaar');

/**
 * Add Bazaar
 * Get Bazaar List
 */

// Registration User..
const addBazaar = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const data = req.body;

    const bazaar = new Bazaar(data);

    bazaar.save()
        .then(() => {
            res.status(200).json({
                message: 'Bazaar Added Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


const getAllBazaar = async (req, res, next) => {
    Bazaar.find()
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'All Bazaar fetch Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


// Exports All Function..
exports.addBazaar = addBazaar;
exports.getAllBazaar = getAllBazaar;
