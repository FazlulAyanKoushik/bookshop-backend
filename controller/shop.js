const {validationResult, query} = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId

// Require Post Schema from Model..
const Carousel = require('../models/carousel');
const OfferSlider = require('../models/offer-slider');
const Book = require('../models/book');
const ContactInfo = require('../models/contact-info');
const OfferProduct = require('../models/offer-product');
const SaleTag = require('../models/sale-tag');
const Menu = require('../models/menu');
const CategoryFilter = require('../models/category-filter');
const SubCategoryFilter = require('../models/sub-category-filter');
const AuthorFilter = require('../models/author-filter');
const PublisherFilter = require('../models/publisher-filter');
const Language = require('../models/language');
const Country = require('../models/country');
const ExtraData = require('../models/extra-data');
const SideMenu = require('../models/side-menu');
const PageInfo = require('../models/page-info');
const CategoryProduct = require("../models/category-product");


/**
 * Add Author
 * Get Author List
 */

exports.addNewCarousel = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const dataModel = new Carousel(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Carousel Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllCarousel = async (req, res, next) => {
    try {
        const data = await Carousel.find();
        res.status(200).json({
            data: data,
            message: 'All Carousel fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleCarouselById = async (req, res, next) => {
    try {
        const data = await Carousel.findOne({_id: req.params.id});
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

exports.deleteCarouselById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Carousel.deleteOne(query);
        res.status(200).json({
            message: 'Carousel delete Successfully!'
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

exports.editCarouselById = async (req, res, next) => {
    try {
        const updatedData = req.body;
        await Carousel.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );

        res.status(200).json({
            message: 'Data Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


/**
 * OFFER BANNER SLIDER
 */

exports.addNewOfferSlider = async (req, res, next) => {

    try {
        const dataModel = new OfferSlider(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Data Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllOfferSlider = async (req, res, next) => {
    try {
        const data = await OfferSlider.find();
        res.status(200).json({
            data: data,
            message: 'All OfferSlider fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleOfferSliderById = async (req, res, next) => {
    try {
        const data = await OfferSlider.findOne({_id: req.params.id});
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

exports.deleteOfferSliderById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await OfferSlider.deleteOne(query);
        res.status(200).json({
            message: 'OfferSlider delete Successfully!'
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

exports.editOfferSliderById = async (req, res, next) => {
    try {
        const updatedData = req.body;
        await OfferSlider.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );

        res.status(200).json({
            message: 'Data Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


/**
 * Contact Info
 */

exports.setContactInfo = async (req, res, next) => {
    try {
        const id = req.body._id;

        if (id === null) {
            const dataModel = new ContactInfo(req.body);
            await dataModel.save();
        } else {
            await ContactInfo.findOneAndUpdate({_id: id}, req.body)
        }

        res.status(200).json({
            message: 'Contact Info Set Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getContactInfo = async (req, res, next) => {
    try {
        const data = await ContactInfo.find();
        res.status(200).json({
            data: data[0],
            message: 'All data fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * OFFER PRODUCT
 */

exports.addOfferProduct = async (req, res, next) => {

    try {
        const data = req.body;
        const product = new OfferProduct(data);
        await product.save();
        res.status(200).json({
            message: 'Product Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllOfferProduct = async (req, res, next) => {

    try {
        const data = await OfferProduct.find({}).populate('product').limit(20)
        res.status(200).json({
            data: data,
            message: 'Product Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getQueryOfferProduct = async (req, res, next) => {

    try {
        const query = {tagSlug: req.params.slug}
        const data = await OfferProduct.find(query).populate('product').limit(10)

        res.status(200).json({
            data: data,
            message: 'Product Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteOfferProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await OfferProduct.deleteOne(query);
        res.status(200).json({
            message: 'Offer Product delete Successfully!'
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


/**
 * OFFER PRODUCT
 */

exports.addSaleTag = async (req, res, next) => {

    try {
        const data = req.body;
        const product = new SaleTag(data);
        await product.save();
        res.status(200).json({
            message: 'Data Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllSaleTag = async (req, res, next) => {
    try {
        const data = await SaleTag.find().select('-books')
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

// exports.getSingleSaleTagWithBook = async (req, res, next) => {
//     let pagination = req.body.pagination;
//     try {
//         const data = await SaleTag.findOne({_id: req.params.id})
//             .populate(
//                 {
//                     path: 'books.book',
//                     model: 'Book',
//                     select: 'name slug price discountPercent categoryName authorName image availableQuantity'
//                 }
//             ).sort({createdAt: -1})

//         res.status(200).json({
//             data: data
//         });

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.getAllSaleTagWithBook = async (req, res, next) => {
    try {
        // const pageSize = +req.query.pageSize;
        // const currentPage = +req.query.page;

        const data = await SaleTag.find()
            .populate(
                [{
                    path: 'books.book',
                    model: 'Book',
                    select: 'name slug price discountPercent categoryName authorName image availableQuantity',
                }]
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

exports.getAllSaleTagWithBookLimit = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;

        const data = await SaleTag.find({})
            .populate(
                [{
                    path: 'books.book',
                    model: 'Book',
                    select: 'name slug price discountPercent categoryName authorName image availableQuantity createdAt',
                }]
            ).sort({createdAt: -1})

        if (data && data.length) {
            data.forEach(m => {
                m.books = m.books.slice(0, 2)
            })
        }

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

exports.getAllSaleTagWithBookLimitAggregate = async (req, res, next) => {
    try {

        const data = await SaleTag.aggregate([
            {
                $lookup: {
                    from: 'books', // This name has always no space and plural string and lower case
                    localField: 'books.book',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: '$product',
            },
            {
                $sort: {'product.createdAt': -1}
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    priority: 1,
                    product: {
                        name: '$product.name',
                        slug: '$product.slug',
                        price: '$product.price',
                        discountPercent: '$product.discountPercent',
                        categoryName: '$product.categoryName',
                        authorName: '$product.authorName',
                        image: '$product.image',
                        availableQuantity: '$product.availableQuantity',
                    },
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: {$first: '$name'},
                    slug: {$first: '$slug'},
                    priority: {$first: '$priority'},
                    products: {$push: '$product'}
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    priority: 1,
                    products: { $slice: [ "$products", 0, 12 ] },
                },
            },
        ])

        res.status(200).json({
            data: data
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

exports.getSingleSaleTagWithBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await SaleTag.aggregate([
            {
                $match: {_id: new ObjectId(id)}
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'books.book',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: '$product',
            },
            {
                $sort: {'product.createdAt': -1}
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    priority: 1,
                    product: {
                        name: '$product.name',
                        slug: '$product.slug',
                        price: '$product.price',
                        discountPercent: '$product.discountPercent',
                        categoryName: '$product.categoryName',
                        authorName: '$product.authorName',
                        image: '$product.image',
                        availableQuantity: '$product.availableQuantity',
                    },
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: {$first: '$name'},
                    slug: {$first: '$slug'},
                    priority: {$first: '$priority'},
                    products: {$push: '$product'}
                }
            },
            // {
            //     $project: {
            //         name: 1,
            //         slug: 1,
            //         priority: 1,
            //         products: { $slice: [ "$products", 0, 12 ] },
            //     },
            // },
        ])

        res.status(200).json({
            data: data && data.length ? data[0] : null
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.editSaleTagById = async (req, res, next) => {
    try {
        const updatedData = req.body;
        await SaleTag.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );
        res.status(200).json({
            message: 'Data updated Successfully!'
        });
    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteSaleTagById= async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await SaleTag.deleteOne(query);
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

exports.removeSaleTagProduct = async (req, res, next) => {

    try {
        const saleTagId = req.body.saleTagId;
        const productId = req.body.productId;

        await SaleTag.updateOne(
            {_id: saleTagId},
            {
                $pull: {
                    books: { _id : new ObjectId(productId) }
                }
            }
        );

        // await Book.findOneAndUpdate({_id: productId}, {
        //     "$set": {
        //         discountPercent: 0
        //     }
        // });

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

exports.editOnSaleProduct = async (req, res, next) => {

    try {
        const saleTagId = req.body.saleTagId;
        const productId = req.body.productId;
        const priority = req.body.priority;

        await SaleTag.updateOne(
            {_id: saleTagId},
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

exports.addOfferBookOnTag = async (req, res, next) => {

    try {
        const data = req.body;

        const mData = data.products.map(m => {
            return {
                book: m,
                priority: 0
            }
        })

        await SaleTag.findOneAndUpdate({_id: data.saleTag}, {
            "$push": {
                books: mData
            }
        })

        // await Book.findOneAndUpdate({_id: data.book}, {
        //     "$set": {
        //         discountPercent: data.discount
        //     }
        // })
        res.status(200).json({
            message: 'Data Added Successfully!'
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

/**
 * MENU BUILDER
 */

exports.addNewMenu = async (req, res, next) => {
    try {

        const dataModel = new Menu(req.body);
        await dataModel.save();

        res.status(200).json({
            message: 'Menu Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllMenu = async (req, res, next) => {
    try {
        const data = await Menu.find();
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

exports.deleteMenuById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Menu.deleteOne(query);

        res.status(200).json({
            message: 'Menu delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editMenuById= async (req, res, next) => {
    try {
        const updatedData = req.body;
        await Menu.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );
        res.status(200).json({
            message: 'Data updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * FILTER DATA
 */

exports.getCategoryFilterData = async (req, res, next) => {

    try {
        const query = {categoryId: req.params.id}
        const data = await CategoryFilter.findOne(query)
            .populate('subCats', 'subCatName slug')
            .populate('authors', 'authorName slug')
            .populate('publishers', 'publisherName slug')
            .populate('companies', 'companyName slug')
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

exports.getSubCategoryFilterData = async (req, res, next) => {

    try {
        const query = {subCatId: req.params.id}
        const data = await SubCategoryFilter.findOne(query)
            // .populate('subCats', 'subCatName slug')
            .populate('authors', 'authorName slug')
            .populate('publishers', 'publisherName slug')

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

exports.getAuthorFilterData = async (req, res, next) => {

    try {
        const query = {authorId: req.params.id}
        const data = await AuthorFilter.findOne(query)
            .populate('categories', 'subCatName slug')
            .populate('publishers', 'publisherName slug')
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

exports.getPublisherFilterData = async (req, res, next) => {

    try {
        const query = {publisherId: req.params.id}
        const data = await PublisherFilter.findOne(query)
            .populate('categories', 'subCatName slug')
            .populate('authors', 'authorName slug')

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

/**
 * BOOK Languages
 */

exports.addLanguage = async (req, res, next) => {

    try {
        const dataModel = new Language(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Data Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getLanguageData = async (req, res, next) => {
    try {
        const data = await Language.find();
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

exports.deleteLanguageById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Language.deleteOne(query);

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

/**
 * Country
 */

exports.addCountry = async (req, res, next) => {

    try {
        const dataModel = new Country(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Data Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCountryData = async (req, res, next) => {
    try {
        const data = await Country.find();
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

exports.deleteCountryById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Country.deleteOne(query);

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

/**
 * Extra Price Data
 */

exports.setExtraPriceInfo = async (req, res, next) => {
    try {
        const dataModel = new ExtraData(req.body);
        await dataModel.save();

        res.status(200).json({
            message: 'Extra Price Info Set Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getExtraPriceInfo = async (req, res, next) => {
    try {
        if (req.query.q) {
            const data = await ExtraData.find().select(req.query.q);
            res.status(200).json({
                data: data[0],
                message: 'All data fetch Successfully!'
            });
        } else {
            const data = await ExtraData.find();
            res.status(200).json({
                data: data[0],
                message: 'All data fetch Successfully!'
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editExtraInfo= async (req, res, next) => {
    try {
        const updatedData = req.body;
        await ExtraData.findOneAndUpdate(
            {},
            {$set: updatedData}
        );
        res.status(200).json({
            message: 'Data updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


/**
 * SIDE MENU BUILDER
 */

exports.addNewSideMenu = async (req, res, next) => {
    try {

        const dataModel = new SideMenu(req.body);
        await dataModel.save();

        res.status(200).json({
            message: 'Side Menu Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllSideMenu = async (req, res, next) => {
    try {
        const data = await SideMenu.find();
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

exports.deleteSideMenuById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await SideMenu.deleteOne(query);

        res.status(200).json({
            message: 'Side Menu Deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editSideMenuById= async (req, res, next) => {
    try {
        const updatedData = req.body;
        await SideMenu.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );
        res.status(200).json({
            message: 'Data updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.addNewPageInfo = async (req, res, next) => {
    try {
        const id = req.body._id;

        if (!id) {
            const data = new PageInfo(req.body);
            await data.save();
        } else {
            await PageInfo.findOneAndUpdate({_id: id}, req.body)
        }

        res.status(200).json({
            message: 'Data Set Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getPageInfoBySlug = async (req, res, next) => {
    try {
        const data = await PageInfo.findOne({slug: req.params.slug});
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
