// Require Main Modules..
const { validationResult } = require('express-validator');


// Require Post Schema from Model..
const Product = require('../models/product');

/**
 * Add Product
 * Add Bulk Product
 * Get All Product List
 * Single Product by Slug
 */

// Registration User..
const addSingleProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const data = req.body;

    const product = new Product(data);

    product.save()
        .then(() => {
            res.status(200).json({
                message: 'Product Added Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const addManyProducts = async (req, res, next) => {
    const data = req.body;

    Product.insertMany(data)
        .then(() => {
            res.status(200).json({
                message: 'Bulk Product Added Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const getAllProducts = async (req, res, next) => {
    Product.find()
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'All Product fetch Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const getProductsByCategory = async (req, res, next) => {
    const category = req.params.slug;

    Product.find({categorySlug: category})
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'All Product Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


const getProductsByBazaar = async (req, res, next) => {
    const slug = req.params.slug;

    Product.find({bazaarSlug: slug})
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'All Product Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


const getProductBySlug = async (req, res, next) => {
    const slug = req.params.slug;


    Product.findOne({slug: slug})
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'Product fetch Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const getProductById = async (req, res, next) => {
    const productId = req.params.productId;


    Product.findOne({_id: productId})
        .then((data) => {
            res.status(200).json({
                data: data,
                message: 'Product fetch Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

/**
 * Text SEARCH
 */

const getSearchProductByText = async (req, res) => {
    try {
        const query = req.query.q;

        const results = await Product.fuzzySearch({ query: query, prefixOnly: false, minSize: 1 })

        res.status(200).json({
            data: results
        });
    } catch (e) {
        console.error(e);
    }
}

/**
 * Edit Product
 */
const editProductData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const updatedData = req.body;
    const query = {_id: updatedData._id}
    const push = { $set: updatedData }

    Product.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Product Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

const deleteProductById = (req, res, next) => {

    const productId = req.body.productId;

    const query = {_id: productId}

    Product.deleteOne(query)
        .then(() => {
            res.status(200).json({
                message: 'Successfully deleted product'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}




// Exports All Function..
exports.addSingleProduct = addSingleProduct;
exports.addManyProducts = addManyProducts;
exports.getAllProducts = getAllProducts;
exports.getProductBySlug = getProductBySlug;
exports.getProductById = getProductById;
exports.getProductsByCategory = getProductsByCategory;
exports.getProductsByBazaar = getProductsByBazaar;
// Search
exports.getSearchProductByText = getSearchProductByText
// Modify
exports.editProductData = editProductData
exports.deleteProductById = deleteProductById
