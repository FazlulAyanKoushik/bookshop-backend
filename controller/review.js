const Book = require('../models/book');
// const User=require("../models/User");
const BooksExtraData = require("../models/book-extra-data");
const Review = require("../models/review");


//POST
//api/book/get-singlw-book-by-id/:id/reviews/addReviews
//Add a review


exports.addReview=async(req,res,next)=>{
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

            review= await Review.findOne({_id:bookExtraData.reviews[i]})

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

            const review= await Review.findByIdAndUpdate(reviewId,req.body,{
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
            const review= await Review.create(req.body);
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


exports.getAllReviewsOfABook = async (req, res, next) => {
    try {
        // let limit = req.body.limit;
        const bookId = req.params.bookId;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;


        let query = await Review.find({book: bookId})
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


//GET
//get single review
//api/reviews/:reviewId

exports.getSingleReview = async (req, res, next) => {
    try {
        const {reviewId} = req.params;
        const review = await Review.findById(reviewId);

        //console.log(reviwe);
        res.json({
            success: true,
            data: review
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'
        }

        next(error);
    }
}

exports.getReviewsOfUser = async (req, res, next) => {
    try {
        const reviews = await Review.find({userId: req.userData.userId})
            .populate('book', 'name slug categoryName authorName image')
        res.json({
            data: reviews
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'
        }

        next(error);
    }
}

//EDIT
//EDIT A single Review
//api/reviews/:reviewId/:bookId

exports.editReview = async (req, res, next) => {
    try {
        const {reviewId} = req.params;

        let {title, text, rating} = req.body;

        const searchedReview = await Review.findById(reviewId);
        const previousRating = searchedReview.rating;

        const book = await Book.findById(req.params.bookId);

        const bookextraDataId = book.bookExtraData;

        const bookExtraData = await BooksExtraData.findById(bookextraDataId);

        bookExtraData.ratingsValue = bookExtraData.ratingsValue - previousRating;

        bookExtraData.ratingsValue = bookExtraData.ratingsValue + rating;


        title = title ? title : searchedReview.title;
        text = text ? text : searchedReview.text;
        rating = rating ? rating : searchedReview.rating;


        const review = await Review.findByIdAndUpdate(reviewId, req.body, {
            new: true,
            runValidators: true
        });


        review.save();
        bookExtraData.save();

        res.json({
            success: true,
            data: review,
            message: "Your review is edited"
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'
        }

        next(error);
    }
}


// DELETE
//Delete a review by user
///api/reviews/:bookId/delete-review-by-user/:reviewId

exports.deleteReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.reviewId);

        const book = await Book.findById(req.params.bookId);

        const bookextraDataId = book.bookExtraData;

        const bookExtraData = await BooksExtraData.findById(bookextraDataId);

        bookExtraData.reviews = bookExtraData.reviews.filter(el => JSON.stringify(req.params.reviewId) !== JSON.stringify(el));

        bookExtraData.ratingsCount = bookExtraData.reviews.length;

        bookExtraData.ratingsValue = bookExtraData.ratingsValue - review.rating;

        bookExtraData.save();

        review = await Review.findByIdAndDelete(req.params.reviewId);


        res.json({
            success: true,
            message: "Review has been Deleted"

        })
    } catch (error) {
        if (!error.statusCode) {
            // console.log(error.meesage)
            error.statusCode = 500;
            error.message = "Something went wrong on database"
        }

        next(error);
    }

}


// DELETE
// Delete the review from the admin
///api/reviews/delete-review-by-admin/:bookId/:reviewId

exports.deleteReviewByAdmin = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.reviewId);

        const book = await Book.findById(req.params.bookId);

        const bookextraDataId = book.bookExtraData;

        const bookExtraData = await BooksExtraData.findById(bookextraDataId);

        bookExtraData.reviews = bookExtraData.reviews.filter(el => JSON.stringify(req.params.reviewId) !== JSON.stringify(el));

        bookExtraData.ratingsCount = bookExtraData.reviews.length;

        bookExtraData.ratingsValue = bookExtraData.ratingsValue - review.rating;

        bookExtraData.save();

        review = await Review.findByIdAndDelete(req.params.reviewId);


        res.json({
            success: true,
            message: "Review has been Deleted"
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = 'Something went wrong on database operation!'
        }

        next(error);
    }


}
