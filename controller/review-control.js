// Require Main Modules..
const {validationResult} = require('express-validator');
// Require Post Schema from Model..
const ObjectId = require('mongoose').Types.ObjectId
const ReviewControl = require('../models/review-control');
const User = require("../models/user");

exports.addReview = async (req, res, next) => {

    try {
        const userId = req.userData.userId;
        const data = req.body;
        const finalData = {...data, ...{user: userId}};

        const reviewControl = new ReviewControl(finalData);

        const saveData = await reviewControl.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                reviews: saveData._id
            }
        })

        res.status(200).json({
            message: 'review Added Successfully!'
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

exports.addReviewById = async(req,res,next)=> {
    try {

        let isAvailable=false;
        let reviewId='';
        let review={};
        let previousRating=0;

        req.body.userId=req.userData.userId;
        req.body.book=req.params.id;

        const book= await Book.findOne({_id:req.params.id});
        const bookextraDataId=book.bookExtraData;

        const bookExtraData=await BooksExtraData.findById(bookextraDataId);

        for(let i=0;i<bookExtraData.reviews.length;i++){

            review= await ReviewControl.findOne({_id:bookExtraData.reviews[i]})

            previousRating=review.rating;

            if(JSON.stringify(req.body.userId)===JSON.stringify(review.userId)){
                isAvailable=true;
                reviewId=bookExtraData.reviews[i];
            }

        }
        // console.log(review,previousRating)

        if(isAvailable){
            bookExtraData.ratingsValue=bookExtraData.ratingsValue-previousRating;

            bookExtraData.ratingsValue=bookExtraData.ratingsValue+req.body.rating;

            const review= await ReviewControl.findByIdAndUpdate(reviewId,req.body,{
                new: true,
                runValidators: true
            });

            review.save();
            bookExtraData.save();

            res.json({
                message:"Review is Edited",

            })

        }
        if(!isAvailable){
            const review= await ReviewControl.create(req.body);
            bookExtraData.reviews.push(review);

            bookExtraData.ratingsCount=bookExtraData.reviews.length;
            bookExtraData.ratingsValue=req.body.rating+bookExtraData.ratingsValue;
            bookExtraData.save();

            res.json({
                message:"Review is added",

            })

        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'

        }

        next(error);
    }
}


exports.getAllReviews = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;


        let query = ReviewControl.find();


        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await query.populate('user', 'fullName profileImg username')
            .populate('book', 'name slug image categoryName authorName publisherName')
            .sort({createdAt: -1});


        const count = await ReviewControl.countDocuments();


        res.status(200).json({
            data: results,
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

exports.getAllReviewsOfABook = async (req, res, next) => {
    try {
        // let limit = req.body.limit;
        const bookId = req.params.bookId;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;


        let query = await ReviewControl.find({book: bookId})
            .populate('userId', 'fullName')
            .skip(startIndex).limit(limit);

        res.json({
            data: query,
            dataCount: query.length
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'
        }
        next(error);
    }
}

exports.getAllReviewsByQuery = async (req, res, next) => {

    try {
        const query = req.body.query;
        if (query.book) {
            query.book = new ObjectId(query.book)
        }

        const select = req.query.select;
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;

        let data;
        let countDoc;
        let ratingsDoc;

        if (!query) {
            data = ReviewControl.find();
            countDoc = ReviewControl.countDocuments();
            ratingsDoc = ReviewControl.aggregate(
                [
                    {
                        $group:
                            {
                                _id: "$residence",
                                total: { $sum: "$rating" },
                                // count: { $sum: 1 }
                            }
                    }
                ]
            )
        } else {
            data = ReviewControl.find(query);
            countDoc = ReviewControl.countDocuments(query);
            ratingsDoc = await ReviewControl.aggregate(
                [
                    {
                        $match: query
                    },
                    {
                        $group:
                            {
                                _id: "$residence",
                                total: { $sum: "$rating" },
                                // count: { $sum: 1 }
                            }
                    }
                ]
            )
        }


        if (pageSize && currentPage) {
            data.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const results = await data
            .select(select ? select : '')
            .populate('user', 'fullName profileImg username')
            .populate('book', 'name slug image categoryName authorName publisherName')
            .sort({createdAt: -1});

        const count = await countDoc;
        const ratings = await ratingsDoc;

        res.status(200).json({
            data: results,
            count: count,
            ratingCounts: ratings && ratings.length ? ratings[0].total : 0
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


exports.getReviewByReviewId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const reviewId = req.params.reviewId;
    const review = await ReviewControl.findOne({_id: reviewId});

    try {
        res.status(200).json({
            data: review,
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

exports.editReview = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const reviewId = req.body._id;

        await ReviewControl.updateOne(
            {_id: reviewId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'Review updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteReviewByReviewId = async (req, res, next) => {

    const reviewId = req.params.reviewId;
    const review = await ReviewControl.findById(reviewId);
    await ReviewControl.deleteOne({_id: reviewId});

    await User.updateOne({_id: review.user}, {$pull: {reviews: new ObjectId(reviewId)}});

    try {
        res.status(200).json({
            message: 'Review Deleted Successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
