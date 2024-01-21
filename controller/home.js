const Home = require("../models/home");
const {validationResult} = require('express-validator');


//POST
//api/home/add-home
//add home
exports.addHome = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }
    try {
        await Home.create(req.body);
        // console.log(home)
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

//GET
//api/home/get-all-homes
//get all home
exports.getAllHomes = async (req, res, next) => {
    try {
        const homes = await Home.find().populate('books', 'name slug categoryName subCatName publisherName authorName image price discountPercent orderTypeName').sort({createdAt: -1});
        res.json({
            message: 'Data fetch successfully',
            data: homes
        })
    } catch (error) {
        res.json({
            success: true,
            error: error.message,
            message: "Something is wrong! Plase check again"
        })
        next(error);
    }
}

//GET
//api/home/get-signle-home/:homeId
//get a single home
exports.getSingleHome = async (req, res, next) => {
    try {
        const home = await Home.findById(req.params.homeId)
            .populate('books', 'name slug categoryName subCatName publisherName authorName image price discountPercent orderTypeName')
        res.json({
            success: true,
            data: home
        })
    } catch (error) {
        res.json({
            success: true,
            error: error.message,
            message: "Something is wrong! Plase check again"
        })
        next(error);
    }
}

//PUT
//api/home/edit-home/:homeId
//edit a home

exports.editHome = async (req, res, next) => {
    try {

        const home = await Home.findByIdAndUpdate(req.body._id, req.body, {
            new: true,
            runValidators: true
        });

        await home.save();

        res.json({
            message: 'Successfully updated data'
        })
    } catch (error) {
        res.json({
            success: true,
            error: error.message,
            message: "Something is wrong! Plase check again"
        })
        next(error);
    }
}

//DELETE
//api/home/delete-home/:homeId
//delete a home

exports.deleteHome = async (req, res, next) => {
    try {
        await Home.findByIdAndDelete(req.params.homeId);
        res.json({
            success: true,
            message: "Home has been deleted"
        })
    } catch (error) {
        res.json({
            success: true,
            error: error.message,
            message: "Something is wrong! Plase check again"
        })
        next(error);
    }
}


exports.removeBook = async (req, res, next) => {
    try {
        const home = await Home.findById(req.params.homeId);
        home.books = home.books.filter(el => JSON.stringify(req.params.bookId) !== JSON.stringify(el));
        home.save();
        console.log(home);

        res.json({
            message: "The book is deleted"
        })

    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }

        next(err);

    }
}
