const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Reward = require('../models/reward');
//const Book = require('../models/book');
//const SubCategory = require('../models/sub-category');

/**
 * Add Reward
 * Get Reward List
 * Get Single Reward
 * Delete Reward
 * Edit Reward
 */

exports.addReward = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const reward = new Reward(data);

    try {
        await reward.save();
        res.status(200).json({
            message: 'Reward Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getReward = async (req, res, next) => {
    try {
        //const pageSize = +req.query.pageSize;
        //const currentPage = +req.query.page;
        //const queryCategory = Category.find().select('-books');

        // if (pageSize && currentPage) {
        //     queryCategory.skip(pageSize * (currentPage - 1)).limit(pageSize)
        // }

        //const categoryCount = await Category.countDocuments();
        const data = await Reward.findOne();

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

exports.updateReward = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const push = { $set: updatedData }

    try {
        //await Book.updateMany({category: updatedData._id}, {$set: {categoryName: updatedData.categoryName, categorySlug: updatedData.slug}});
        //await SubCategory.updateMany({parentCategory: updatedData._id}, {$set: {parentCategoryName: updatedData.categoryName}});
        //await Category.findOneAndUpdate({_id: updatedData._id}, push);
        await Reward.findOneAndUpdate({}, push);
        res.status(200).json({
            message: 'Reward Updated Successfully!'
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