const SubCategoryProduct = require("../models/sub-category-product");
const ObjectId = require('mongoose').Types.ObjectId


exports.addSubCategoryProduct = async (req, res, next) => {

    try {
        await SubCategoryProduct.create(req.body);

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

exports.deleteSubCategoryProductById= async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await SubCategoryProduct.deleteOne(query);

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

exports.getAllSubCategoryProducts = async (req, res, next) => {
    try {
        const data = await SubCategoryProduct.find()
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


exports.getSingleSubCategoryProduct = async (req, res, next) => {
    try {
        const data = await SubCategoryProduct.findOne({_id: req.params.id});

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

exports.getSingleSubCategoryProductPopulate = async (req, res, next) => {
    try {
        const data = await SubCategoryProduct.findOne({_id: req.params.id})
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


exports.editSubCategoryProduct = async (req, res, next) => {
    try {
        const data = req.body;

        await SubCategoryProduct.findOneAndUpdate(
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

exports.editSubCategoryProductPriority = async (req, res, next) => {

    try {
        const subCategoryId = req.body._id;
        const productId = req.body.productId;
        const priority = req.body.priority;

        await SubCategoryProduct.updateOne(
            {_id: subCategoryId},
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

exports.removeSubCategoryProduct = async (req, res, next) => {

    try {
        const id = req.body.id;
        const productId = req.body.productId;

        await SubCategoryProduct.updateOne(
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
