// Require Main Modules..
const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Newsletter = require('../models/newsletter');

exports.addNewsletter = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    const newsletter = new Newsletter(data);

    try {

        await newsletter.save();
        res.status(200).json({
            message: 'Newsletter Added Successfully!'
        });
    } catch (err) {
        // console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getNewsletters = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = Newsletter.find();


        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const newsletterCount = await Newsletter.countDocuments();

        const data = await query

        res.status(200).json({
            data: data,
            count: newsletterCount
        });
    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateNewsletter = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const id = req.body.id;
        // const data = req.body.images.length === 0 ? null : req.body.images

        await Newsletter.findOneAndUpdate({_id: id}, req.body);
        res.status(200).json({
            message: 'Newsletter Updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteNewsletter = async (req, res, next) => {

    try {
        const id = req.params.id;
        // const data = req.body.images.length === 0 ? null : req.body.images

        await Newsletter.findOneAndDelete({_id: id});
        res.status(200).json({
            message: 'Newsletter deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
