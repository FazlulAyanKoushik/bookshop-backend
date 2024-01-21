
const User = require('../models/user');
const Order = require('../models/order');
const Book = require('../models/book');

exports.getUserCount=async (req,res,next)=>{
    try {
        
        const dataCount = await User.countDocuments();

        res.status(200).json({
            count: dataCount,
            message: 'Users Counted Succesfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
exports.getOrdersCount=async (req,res,next)=>{
    try {
        
        const orderCount = await Order.countDocuments();

        res.status(200).json({
            count: orderCount,
            message: 'Orders Counted Succesfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
exports.getProfitAmount=async (req,res,next)=>{
    
}
exports.getBookCount=async(req,res,next)=>{
    try {
        
        const bookCount = await Book.countDocuments();

        res.status(200).json({
            count: bookCount,
            message: 'Books Counted Succesfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}