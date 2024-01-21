const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Company = require('../models/company');
const Book = require('../models/book');

/**
 * Add Publisher
 * Get Publisher List
 */

exports.addNewCompany = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const company = new Company(data);

    try {
        await company.save();
        res.status(200).json({
            message: 'Company Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllCompany = async (req, res, next) => {
    try {
        const data = await Company.find();
        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    const query = {_id: companyId}

    try {
        const data = await Company.findOne(query);

        res.status(200).json({
            data: data,
            message: 'Publisher fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getASingleCompanyBySlug = async (req, res, next) => {
    const companySlug = req.params.slug;
    const query = {slug: companySlug}

    try {
        const data = await Company.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Publisher fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    const query = {_id: companyId}

    try {
        const data = await Company.deleteOne(query);
        res.status(200).json({
            data: data,
            message: 'Author delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editCompanyData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const query = {_id: updatedData._id}
    const push = {$set: updatedData}

    Company.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Company Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


exports.getCompanyBookCountById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const pubId = req.params.id;
    const count = await Book.countDocuments({Company: pubId});

    try {
        res.status(200).json({
            count: count,
            message: 'Successfully Retrieved Count'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}
