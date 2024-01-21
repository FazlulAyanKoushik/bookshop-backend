const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Publisher = require('../models/publisher');
const Book = require('../models/book');

/**
 * Add Publisher
 * Get Publisher List
 */

exports.addNewPublisher = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const publisher = new Publisher(data);

    try {
        await publisher.save();
        res.status(200).json({
            message: 'Publisher Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllPublisher = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = Publisher.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData;
        const dataCount = await Publisher.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASinglePublisherById = async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await Publisher.findOne(query);
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

exports.getASinglePublisherSEOById= async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await Publisher.findOne(query, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$publisherName'});
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

exports.getASinglePublisherBySlug = async (req, res, next) => {
    const publisherSlug = req.params.slug;
    const query = {slug: publisherSlug}

    try {
        const data = await Publisher.findOne(query);
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


exports.deletePublisherById = async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await Publisher.deleteOne(query);
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

// exports.editPublisherData = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Input Validation Error! Please complete required information.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         next(error)
//         return;
//     }

//     const updatedData = req.body;
//     const query = {_id: updatedData._id}
//     const push = {$set: updatedData}

//     Publisher.findOneAndUpdate(query, push)
//         .then(() => {
//             res.status(200).json({
//                 message: 'Publisher Updated Success!'
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })

// }

exports.editPublisherData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    console.log(updatedData);
    const push = { $set: updatedData }

    try {
        await Book.updateMany({publisher: updatedData._id}, {$set: {publisherName: updatedData.publisherName, publisherSlug: updatedData.slug}});
        await Publisher.findOneAndUpdate({_id: updatedData._id}, push);
        res.status(200).json({
            message: 'Category Updated Successfully!'
        });

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getPublisherBookCountById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const pubId = req.params.id;
    const count = await Book.countDocuments({publisher: pubId});

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
