const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const SubCategory = require('../models/sub-category');
const Category = require('../models/category');
const Book = require('../models/book');
const subCategory = require('../models/sub-category');

/**
 * Add Publisher
 * Get Publisher List
 */

exports.addNewSubCat = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {

        const data = new SubCategory(req.body);
        await data.save();

        res.status(200).json({
            message: 'Sub Category Added Successfully!'
        });
    } catch (err) {
        console.log('ERROR',err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllSubCategory = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = subCategory.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData;
        const dataCount = await subCategory.countDocuments();

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

exports.getSubCatsByParentCatId = async (req, res, next) => {
    try {
        const catId = req.params.id;
        const data = await SubCategory.find({parentCategory: catId})

        res.status(200).json({
            data: data,
            message: 'All Sub Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleSubCategoryById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await SubCategory.findOne(query);
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

exports.getASingleSubCategorySEOById= async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await SubCategory.findOne(query, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$subCatName'});
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

exports.getASingleSubCategoryBySlug = async (req, res, next) => {
    const publisherSlug = req.params.slug;
    const query = {slug: publisherSlug}

    try {
        const data = await SubCategory.findOne(query);
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


exports.deleteSubCategoryById = async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await SubCategory.deleteOne(query);
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

// exports.editSubCategoryData = (req, res, next) => {
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

//     SubCategory.findOneAndUpdate(query, push)
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

exports.editSubCategoryData = async (req, res, next) => {
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
        await Book.updateMany({subCategory: updatedData._id}, {$set: {subCatName: updatedData.subCatName, subCatSlug: updatedData.slug}});
        await SubCategory.findOneAndUpdate({_id: updatedData._id}, push);
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

exports.getSubCategoryFilter = async (req, res, next) => {

    try {
        const slug = req.params.slug;

        const result = await SubCategory.findOne({slug: slug}).select('filters priceRange -_id');
        res.status(200).json({
            data: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSubCatsByParentSlug= async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const category = await Category.findOne({slug: slug}).distinct('_id');
        const data = await SubCategory.find({parentCategory: category[0]})
            .select('subCatName slug')

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

