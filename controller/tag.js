const {validationResult} = require('express-validator');

// Require Post Schema from Model..
// const SubCategory = require('../models/sub-category');
// const Category = require('../models/category');
const Tag = require('../models/tag');

/**
 * Add Tag
 * Get Tag List
 */

 exports.addSingleTag = async (req, res, next) => {

    try {

        const data = req.body;
        const dataExists = await Tag.findOne({tagSlug: data.tagSlug}).lean();

        if (dataExists) {
            const error = new Error('A product tag with this name/slug already exists');
            error.statusCode = 406;
            next(error)
        } else {
            const tag = new Tag(data);
            const tagRes = await tag.save();
            res.status(200).json({
                response: tagRes,
                message: 'Tag Added Successfully!'
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertManyTag = async (req, res, next) => {

    try {
        const data = req.body;
        await Tag.deleteMany({});
        const result = await Tag.insertMany(data);

        res.status(200).json({
            message: `${result && result.length ? result.length : 0} Tags imported Successfully!`
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllTags = async (req, res, next) => {
    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = Tag.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await query;
        const count = await Tag.countDocuments();

        res.status(200).json({
            data: results,
            count: count,
            message: 'All Product fetch Successfully!'
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

exports.getTagByTagId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const tagId = req.params.tagId;
    const productTag = await Tag.findOne({_id: tagId});

    try {
        res.status(200).json({
            data: productTag,
            message: 'Tag Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editTagData = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Tag.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            message: 'Tag Updated Successfully!'
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

exports.deleteTagByTagId = async (req, res, next) => {

    const tagId = req.params.tagId;
    await Tag.deleteOne({_id: tagId});

    try {
        res.status(200).json({
            message: 'Tag Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getTagsBySearch = async (req, res, next) => {
    try {

        const search = req.query.q;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const newQuery = search.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({tagName: RegExp(str, 'i')}));
        // const regex = new RegExp(query, 'i')

        let productTags = Tag.find({
            $or: [
                { $and: queryArray }
            ]
        });

        if (pageSize && currentPage) {
            productTags.skip(pageSize * (currentPage - 1)).limit(Number(pageSize))
        }

        const results = await productTags;
        const count = results.length;


        res.status(200).json({
            data: results,
            count: count
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
