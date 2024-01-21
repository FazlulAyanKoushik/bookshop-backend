const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Author = require('../models/author');
const Book = require('../models/book');

/**
 * Add Author
 * Get Author List
 */

exports.addNewAuthor = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const author = new Author(data);

    try {
        await author.save();
        res.status(200).json({
            message: 'Author Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllAuthors = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = Author.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData;
        const dataCount = await Author.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'All Author fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleAuthorById= async (req, res, next) => {
    const authorId = req.params.id;
    const query = {_id: authorId}

    try {
        const data = await Author.findOne(query);
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

exports.getASingleAuthorSEOById= async (req, res, next) => {
    const authorId = req.params.id;
    const query = {_id: authorId}

    try {
        const data = await Author.findOne(query, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$authorName'});
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

exports.getASingleAuthorBySlug= async (req, res, next) => {
    const authorSlug = req.params.slug;
    const query = {slug: authorSlug}

    try {
        const data = await Author.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Author fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteAuthorById= async (req, res, next) => {
    const authorId = req.params.id;
    const query = {_id: authorId}

    try {
        const data = await Author.deleteOne(query);
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

// exports.editAuthorData = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Input Validation Error! Please complete required information.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         next(error)
//         return;
//     }

//     const updatedData = req.body;
//     console.log(updatedData);
//     const query = {_id: updatedData._id}
//     const push = { $set: updatedData }

//     Author.findOneAndUpdate(query, push)
//         .then(() => {
//             res.status(200).json({
//                 message: 'Author Updated Success!'
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })

// }

exports.editAuthorData = async (req, res, next) => {
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
        await Book.updateMany({author: updatedData._id}, {$set: {authorName: updatedData.authorName, authorSlug: updatedData.slug}});
        await Author.findOneAndUpdate({_id: updatedData._id}, push);
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
