const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Category = require('../models/category');
const Book = require('../models/book');
const SubCategory = require('../models/sub-category');

/**
 * Add Category
 * Get Category List
 * Get Single Category
 * Delete Category
 * Edit Category
 */

exports.addNewCategory = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const category = new Category(data);

    try {
        await category.save();
        res.status(200).json({
            message: 'Category Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllCategory = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = Category.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData;
        const dataCount = await Category.countDocuments();

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

exports.getASingleCategoryById= async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Category.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleCategorySEOById= async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Category.findOne(query, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$categoryName'});
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

exports.getASingleCategoryBySlug= async (req, res, next) => {
    const catSlug = req.params.slug;
    const query = {slug: catSlug}

    try {
        const data = await Category.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteCategoryById= async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Category.deleteOne(query);
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

// exports.editCategoryData = (req, res, next) => {
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
//     const push = { $set: updatedData }

//     Category.findOneAndUpdate(query, push)
//         .then(() => {
//             res.status(200).json({
//                 message: 'Category Updated Success!'
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })

// }

exports.editCategoryData = async (req, res, next) => {
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
        await Book.updateMany({category: updatedData._id}, {$set: {categoryName: updatedData.categoryName, categorySlug: updatedData.slug}});
        await SubCategory.updateMany({parentCategory: updatedData._id}, {$set: {parentCategoryName: updatedData.categoryName}});
        await Category.findOneAndUpdate({_id: updatedData._id}, push);
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