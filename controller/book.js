const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Book = require('../models/book');
const BookExtraData = require('../models/book-extra-data');
const PriceDataExtra = require('../models/price-extra-data');
const Author = require('../models/author');
const Category = require('../models/category');
const Publisher = require('../models/publisher');
const AuthorFilter = require('../models/author-filter');
const CategoryFilter = require('../models/category-filter');
const SubCategoryFilter = require('../models/sub-category-filter');
const PublisherFilter = require('../models/publisher-filter');
const SubCategory = require('../models/sub-category');
const User =  require('../models/user');

/**
 * ADD SINGLE BOOK NEW WAY
 * Add Book
 * Add Bulk Book
 * Get All Book List
 * Single Book by Slug
 */
exports.addSingleBookNew = async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const bookCoreData = new Book(req.body.bookCoreData);
        const priceDataExtra = new PriceDataExtra(req.body);
        const bookCoreDataRes = await bookCoreData.save();
        let bookExtraDataRes;
        let priceDataExtraRes;

        if (req.body.extraData) {
            const bookExtraData = new BookExtraData(req.body.extraData);
            bookExtraDataRes = await bookExtraData.save();
        }


        if (req.body.priceExtra !== null) {
            priceDataExtraRes = await priceDataExtra.save();
        }

        let setQuery;

        if (req.body.priceExtra === null) {
            setQuery = {
                bookExtraData: bookExtraDataRes ? bookExtraDataRes._id : null,
                priceData: null,
            }
        } else {
            setQuery = {
                bookExtraData: bookExtraDataRes ? bookExtraDataRes._id : null,
                priceData: priceDataExtraRes._id,
            }
        }


        await Book.findOneAndUpdate({_id: bookCoreDataRes._id}, {
            $set: setQuery
        });

        // ** Create Sub Category Filter List **
        const checkCategoryFilter = await CategoryFilter.findOne({categoryId: req.body.bookCoreData.category});

        if (checkCategoryFilter) {
            let pushData;
            if (req.body.bookCoreData.company) {
                pushData = {
                    subCats: req.body.bookCoreData.subCategory,
                    companies: req.body.bookCoreData.company
                }
            } else {
                pushData = {
                    subCats: req.body.bookCoreData.subCategory,
                    authors: req.body.bookCoreData.author,
                    publishers: req.body.bookCoreData.publisher
                }
            }
            await CategoryFilter.findOneAndUpdate({categoryId: req.body.bookCoreData.category}, {
                "$addToSet": pushData
            })
        } else {
            const s = [req.body.bookCoreData.subCategory];
            const a = [req.body.bookCoreData.author];
            const p = [req.body.bookCoreData.publisher];
            const c = [req.body.bookCoreData.company];
            let setData;

            if (req.body.bookCoreData.company) {
                setData = {
                    categoryId: req.body.bookCoreData.category,
                    subCats: s,
                    companies: c
                }
            } else {
                setData = {
                    categoryId: req.body.bookCoreData.category,
                    subCats: s,
                    authors: a,
                    publishers: p
                }
            }

            const filter = new CategoryFilter(setData);

            await filter.save();
        }

        // Create Sub Category Filter List
        const checkSubCategoryFilter = await SubCategoryFilter.findOne({subCatId: req.body.bookCoreData.subCategory});

        if (checkSubCategoryFilter) {
            let pushData;
            if (req.body.bookCoreData.company) {
                pushData = {
                    companies: req.body.bookCoreData.company
                }
            } else {
                pushData = {
                    authors: req.body.bookCoreData.author,
                    publishers: req.body.bookCoreData.publisher
                }
            }
            await SubCategoryFilter.findOneAndUpdate({subCatId: req.body.bookCoreData.subCategory}, {
                "$addToSet": pushData
            })
        } else {
            const a = [req.body.bookCoreData.author];
            const p = [req.body.bookCoreData.publisher];
            const c = [req.body.bookCoreData.company];
            let setData;

            if (req.body.bookCoreData.company) {
                setData = {
                    subCatId: req.body.bookCoreData.subCategory,
                    companies: c
                }
            } else {
                setData = {
                    subCatId: req.body.bookCoreData.subCategory,
                    authors: a,
                    publishers: p
                }
            }

            const filter = new SubCategoryFilter(setData)

            await filter.save();
        }

        // Create Author Filter List
        if (req.body.bookCoreData.author) {
            const checkAuthorFilter = await AuthorFilter.findOne({authorId: req.body.bookCoreData.author});

            if (checkAuthorFilter) {
                await AuthorFilter.findOneAndUpdate({authorId: req.body.bookCoreData.author}, {
                    "$addToSet": {
                        categories: req.body.bookCoreData.subCategory,
                        publishers: req.body.bookCoreData.publisher
                    }
                })
            } else {
                const c = [req.body.bookCoreData.subCategory];
                const p = [req.body.bookCoreData.publisher];

                const filter = new AuthorFilter(
                    {
                        authorId: req.body.bookCoreData.author,
                        categories: c,
                        publishers: p
                    }
                )

                await filter.save();
            }
        }

        // Create Publishers Filter List
        if (req.body.bookCoreData.publisher) {
            const checkPublisherFilter = await PublisherFilter.findOne({publisherId: req.body.bookCoreData.publisher});

            if (checkPublisherFilter) {
                await PublisherFilter.findOneAndUpdate({publisherId: req.body.bookCoreData.publisher}, {
                    "$addToSet": {
                        categories: req.body.bookCoreData.subCategory,
                        authors: req.body.bookCoreData.author
                    }
                })
            } else {
                const c = [req.body.bookCoreData.subCategory];
                const a = [req.body.bookCoreData.author];

                const filter = new PublisherFilter(
                    {
                        publisherId: req.body.bookCoreData.publisher,
                        categories: c,
                        authors: a
                    }
                )

                await filter.save();
            }
        }


        res.status(200).json({
            data: bookCoreData,
            message: 'Book Added Successfully!'
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

exports.addSingleBook = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    try {
        const book = new Book(data);
        const bookRes = await book.save();

        await Category.findOneAndUpdate({_id: book.category}, {
            "$push": {
                books: bookRes._id
            }
        })
        await Author.findOneAndUpdate({_id: book.author}, {
            "$push": {
                books: bookRes._id
            }
        })
        await Publisher.findOneAndUpdate({_id: book.publisher}, {
            "$push": {
                books: bookRes._id
            }
        })
        res.status(200).json({
            message: 'Book Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBooks = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const queryProduct = Book.find();

        if (pageSize && currentPage) {
            queryProduct.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const productsCount = await Book.countDocuments();

        const data = await queryProduct.sort({createdAt: -1})

        res.status(200).json({
            data: data,
            count: productsCount
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleBookBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await Book.findOne(query)
            .populate('priceData', '-_id priceExtra')
            .populate('bookExtraData')
            .populate('tag')
            .populate('packages', 'name image slug categoryName categorySlug subCategory subCatName subCatSlug price discountPercent availableQuantity')
            .sort({createdAt: -1})

        // .populate('publisher', '_id publisherName slug')
        // console.log(data.tag.tags[1]);
        res.status(200).json({
            data: data,
            message: 'Book fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleBookById = async (req, res, next) => {
    const bookId = req.params.id;
    try {
        const query = {_id: bookId};
        const data = await Book.findOne(query)
            .populate('bookExtraData')
            .populate('priceData')
            .populate('packages', 'name image slug categoryName categorySlug authorName')
            .sort({createdAt: -1})

        res.status(200).json({
            data: data,
            message: 'Book fetch Successfully!'
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
 * GET BEST SELLER BOOKS
 */

exports.getBestSellerBooks = async (req, res, next) => {

    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = Book.find({categorySlug: {$ne: "bookish-gadgets"}}).sort({soldQuantity: -1});

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.sort({createdAt: -1})
        const dataCount = await Book.countDocuments({categorySlug: {$ne: "bookish-gadgets"}});

        res.status(200).json({
            data: data,
            count: dataCount
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
 * Text SEARCH
 */

exports.getSearchBookByText = async (req, res, next) => {
    try {
        const query = req.query.q;
        const results = await Book.fuzzySearch({query: query, prefixOnly: false, minSize: 1})
            .limit(20)
            .sort({createdAt: -1})

        // .populate('category', '_id categoryName slug')
        // .populate('author', '_id authorName slug')
        // .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: results
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


exports.getSearchBookByRegex = async (req, res, next) => {
    try {
        const query = req.query.q;
        const parent = req.query.parent;

        const regex = new RegExp(query, 'i')

        const results = await Book.find(
            {
                $and: [
                    {
                        $or: [
                            {name: regex},
                            {slug: regex},
                        ]
                    },
                    {categorySlug: parent}
                ]
            }
        ).limit(20);

        res.status(200).json({
            data: results
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
 * Edit Product
 * Update
 * Modify
 */

exports.updateBookData = async (req, res, next) => {
    try {
        let bookCoreData = req.body.bookCoreData;
        // const bookExtraData = req.body.extraData;
        const priceDataExtra = req.body.priceExtra;

        let bookExtraDataRes;

        // console.log(bookCoreData.bookExtraData)
        // console.log(req.body.extraData)

        if (bookCoreData.bookExtraData === null) {
            const bookExtraData = new BookExtraData(req.body.extraData);
            bookExtraDataRes = await bookExtraData.save();
            await Book.findOneAndUpdate(
                {_id: bookCoreData._id},
                {$set: {bookCoreData, ...{bookExtraData: bookExtraDataRes._id}}}
            );
        } else {
            await BookExtraData.findOneAndUpdate(
                {_id: bookCoreData.bookExtraData},
                {$set: req.body.extraData}
            );

            await Book.findOneAndUpdate(
                {_id: bookCoreData._id},
                {$set: bookCoreData}
            );

        }

        // await Book.findOneAndUpdate(
        //     {_id: bookCoreData._id},
        //     {$set: bookCoreData}
        // );
        // await BookExtraData.findOneAndUpdate(
        //     {_id: bookCoreData.bookExtraData},
        //     {$set: bookExtraData}
        // );

        if (priceDataExtra !== null && bookCoreData.priceData !== null) {
            await PriceDataExtra.findOneAndUpdate(
                {_id: bookCoreData.priceData},
                {$set: {priceExtra: priceDataExtra}}
            );
        } else if (bookCoreData.priceData === null && priceDataExtra !== null) {
            const priceDataExtra = new PriceDataExtra(req.body);
            const priceDataExtraRes = await priceDataExtra.save();
            await Book.findOneAndUpdate(
                {_id: bookCoreData._id},
                {$set: {priceData: priceDataExtraRes._id}}
            )
        } else {
            console.log('No Price Data');
        }


        res.status(200).json({
            message: 'Data updated Successfully!'
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

exports.updateBookField = async (req, res, next) => {

    try {
        const id = req.body.id;
        const query = req.body.query

        await Book.findOneAndUpdate({_id: id}, {
            $set: query
        })
        res.status(200).json({
            message: 'Book Image Updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteBookById = async (req, res, next) => {

    const bookId = req.params.id;

    try {
        const query = {_id: bookId}
        const book = await Book.findOne(query).select('priceData bookExtraData -_id')
        await Book.deleteOne(query)

        // Remove Additional Data
        await BookExtraData.deleteOne({_id: book.bookExtraData});
        await PriceDataExtra.deleteOne({_id: book.priceData});

        res.status(200).json({
            message: 'Data deleted Successfully!'
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
 * GET BY QUERY
 */

exports.getAllBooksByCategory = async (req, res, next) => {

    const catId = req.params.id;

    try {
        const booksId = await Category.find({_id: catId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')
            .sort({createdAt: -1})

        res.status(200).json({
            data: allBooks,
            message: 'All Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBooksByAuthor = async (req, res, next) => {

    const authorId = req.params.id;

    try {
        const booksId = await Author.find({_id: authorId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: allBooks,
            message: 'All Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBooksByPublisher = async (req, res, next) => {

    const publisherId = req.params.id;

    try {
        const booksId = await Publisher.find({_id: publisherId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')
            .sort({createdAt: -1})

        res.status(200).json({
            data: allBooks,
            message: 'All Product fetch Successfully!'
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
 * GET PREORDER BOOK
 */

exports.getPreOrderBooksByLimit = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const queryProduct = Book.find({orderTypSlug: 'pre-order'});

        if (pageSize && currentPage) {
            queryProduct.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const productsCount = await Book.countDocuments({orderTypSlug: 'pre-order'});

        const data = await queryProduct.sort({createdAt: -1})


        res.status(200).json({
            data: data,
            count: productsCount
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
 * GET BOOK BY QUERY
 */
exports.getBooksByQuery = async (req, res, next) => {

    try {
        let pagination = req.body.pagination;
        const query = req.body.query;
        const sort = req.body.sort;
        const select = req.body.select;

        let queryData;
        let countDoc;

        if (query) {
            queryData = Book.find(query);
            countDoc = Book.countDocuments(query);
        } else {
            queryData = Book.find();
            countDoc = Book.countDocuments();
        }

        if (sort) {
            queryData = queryData.sort(sort)
        }
        if (select) {
            queryData = queryData.select(select)
        }

        if (pagination && pagination.pageSize && pagination.currentPage) {
            queryData.skip(Number(pagination.pageSize) * (Number(pagination.currentPage) - 1)).limit(Number(pagination.pageSize))
        }

        const count = await countDoc;
        const data = await queryData.sort({createdAt: -1})

        res.status(200).json({
            data: data,
            count: count
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getSpecificBooksById = async (req, res, next) => {

    try {

        const dataIds = req.body.ids;
        const query = {_id: {$in: dataIds}}
        const data = await Book.find(query)
        .select('_id name slug image price discountPercent availableQuantity categoryName author authorName publisherName publisherSlug priceData orderTypSlug')
        .populate('priceData');

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

exports.getRelatedBooks = async (req, res, next) => {

    try {

        let limit = req.body.limit;
        const query = req.body.query;

        const queryData = Book.find(query);

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(limit.pageSize * (limit.currentPage - 1)).limit(limit.pageSize)
        }

        const dataCount = await Book.countDocuments(query);

        const data = await queryData;

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

/**
 * FILTER PRODUCTS
 */
exports.filterByDynamicFilters = async (req, res, next) => {

    try {

        let limit = req.body.paginate;
        const query = req.body.query;
        const parent = req.body.parent;
        let queryData;


        if (req.body.sort) {
            queryData = Book.find(
                {
                    $and: [
                        {
                            $or: [
                                query
                            ]
                        },
                        parent,
                    ]
                }
            ).sort(req.body.sort);
        } else {
            queryData = Book.find(
                {
                    $and: [
                        {
                            $or: [
                                query
                            ]
                        },
                        parent
                    ]
                }
            );
        }

        if (limit && limit.pageSize && limit.currentPage) {
            queryData.skip(Number(limit.pageSize) * (Number(limit.currentPage) - 1)).limit(Number(limit.pageSize))
        }

        const dataCount = await Book.countDocuments(
            {
                $and: [
                    {
                        $or: [
                            query
                        ]
                    },
                    parent
                ]
            }
        );

        const data = await queryData;


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



exports.getFromCollectionBySearch = async (req, res, next) => {
    try {
        console.log(req.query);

        let collectionName;

        switch (req.query.collectionName) {
            case "book":
            case "Book":
                collectionName = Book;
                break;
            case "author":
            case "Author":
                collectionName = Author;
                break;
            case "category":
            case "Category":
                collectionName = Category;
                break;
            case "publisher":
            case "Publisher":
                collectionName = Publisher;
                break;
            case "user":
            case "User":
                collectionName = User; 
                break;
            case "sub-category":
            case "subcategory":
            case "subCategory":
            case "SubCategory":
                collectionName = SubCategory;
                break;
            default:
                collectionName = Book;
                break;
        }

        console.log(collectionName);
        console.log(req.query.collectionName);

        const query = req.query.q;
        console.log(query);
        const searchField1 = req.query.searchField1, searchField2 = req.query.searchField2;
        const filterKey = req.query.filterKey, filterValue = req.query.filterValue;
        const paginate = req.body.paginate;

        const newQuery = query.split(/[ ,]+/);
        let queryArray1;
        if (searchField1 && searchField2) {
            queryArray1 = [
                {"$and": newQuery.map((string) => ({[searchField1]: RegExp(string, 'i')}))},
                {"$and": newQuery.map((string) => ({[searchField2]: RegExp(string, 'i')}))}
            ]
        }
        ;

        let results, count;

        if (queryArray1) {
            results = collectionName.find({$or: queryArray1});
            count = await collectionName.find({$or: queryArray1}).countDocuments();

        } else if (filterKey && filterValue && queryArray1) {
            results = collectionName.find({$or: queryArray1, [filterKey]: filterValue});
            count = await collectionName.find({$or: queryArray1, [filterKey]: filterValue}).countDocuments();

        } else {
            const keys = ["name", "slug", "categoryName", "categorySlug", "subCatName", "subCatSlug", "publisherName", "publisherSlug", "authorName", "authorSlug"];
            const queryArray2 = [];
            keys.forEach(key => queryArray2.push({"$and": newQuery.map((str) => ({[key]: RegExp(str, 'i')}))}));
            results = collectionName.find({$or: queryArray2});
            count = await collectionName.find({$or: queryArray2}).countDocuments();
        }

        if (paginate) {
            results.skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1)).limit(Number(paginate.pageSize));
        }

        const data = await results;
        //console.log(data);

        res.status(200).json({
            data: data,
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


/*
exports.editBookData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;

    try {
        const query = {_id: updatedData._id};
        const push = {$set: updatedData};
        const oldBook = await Book.findOne(query);
        await Book.findOneAndUpdate(query, push);

        // Update Category Ref
        if (oldBook.category !== updatedData.category) {
            await Category.updateOne(
                {_id: oldBook.category},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Category.findOneAndUpdate({_id: updatedData.category}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        if (oldBook.author !== updatedData.author) {
            await Author.updateOne(
                {_id: oldBook.author},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Author.findOneAndUpdate({_id: updatedData.author}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        if (oldBook.publisher !== updatedData.publisher) {
            await Publisher.updateOne(
                {_id: oldBook.publisher},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Publisher.findOneAndUpdate({_id: updatedData.publisher}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        res.status(200).json({
            message: 'Book Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

*/
