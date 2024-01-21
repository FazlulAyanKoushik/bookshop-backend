const CategoryProduct = require("../models/category-product");
const ObjectId = require('mongoose').Types.ObjectId


exports.addCategoryProduct = async (req, res, next) => {

    try {
        await CategoryProduct.create(req.body);

        res.json({
            message: 'Data added successfully'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteCategoryProductById= async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await CategoryProduct.deleteOne(query);

        res.status(200).json({
            message: 'Data delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllCategoryProducts = async (req, res, next) => {
    try {
        const data = await CategoryProduct.find()
            .populate(
                {
                    path: 'books.book',
                    model: 'Book',
                    select: 'name slug categoryName subCatName publisherName authorName image price discountPercent orderTypeName'
                }
            ).sort({createdAt: -1})

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


exports.getSingleCategoryProduct = async (req, res, next) => {
    try {
        const data = await CategoryProduct.findOne({_id: req.params.id});

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

exports.getSingleCategoryProductPopulate = async (req, res, next) => {
    try {
        const data = await CategoryProduct.findOne({_id: req.params.id})
            .populate(
                {
                    path: 'books.book',
                    // options: {sort: {'createdAt': 1}},
                    model: 'Book',
                    select: 'name slug categoryName subCatName publisherName authorName image price discountPercent orderTypeName createdAt',
                },
            );

            // console.log('')
            // console.log('1')
            // console.log(data.books)

            // newData = data.books.map(item => item.sort({createdAt: -1}))

            // console.log('')
            // console.log('modified bookes')
            // console.log(newData)

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


exports.editCategoryProduct = async (req, res, next) => {
    try {
        const data = req.body;

        await CategoryProduct.findOneAndUpdate(
            {_id: data._id},
            {$set: data}
        )

        res.status(200).json({
            message: 'Successfully updated'
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

exports.editCategoryProductPriority = async (req, res, next) => {

    try {
        const categoryId = req.body._id;
        const productId = req.body.productId;
        const priority = req.body.priority;

        await CategoryProduct.updateOne(
            {_id: categoryId},
            {
                $set: {
                    'books.$[e1].priority': priority
                }
            }, {
                arrayFilters: [
                    { "e1.book": new ObjectId(productId) }
                ]
            }
        );

        res.status(200).json({
            message: 'Data delete Successfully!'
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

exports.removeCategoryProduct = async (req, res, next) => {

    try {
        const id = req.body.id;
        const productId = req.body.productId;

        await CategoryProduct.updateOne(
            {_id: id},
            {
                $pull: {
                    books: { book : new ObjectId(productId) }
                }
            }
        );

        res.status(200).json({
            message: 'Data delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
