// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');


/**
 * User Registration
 * User Login
 */

exports.userFacebookAuth = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const user = new User(bodyData);
        let token;


        const userExists = await User.findOne({registrationType: 'facebook', uID: bodyData.uID}).lean();

        if (userExists) {
            // When User Already Exists
            token = jwt.sign({
                    username: userExists.username,
                    userId: userExists._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        } else {
            // When User Not Exists
            const newUser = await user.save();

            token = jwt.sign({
                    username: newUser.username,
                    email: newUser.email,
                    userId: newUser._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.userRegistrationDefault = async (req, res, next) => {
    const errors = validationResult(req);
    // Check Input validation Error with Error Handler..
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const bodyData = req.body;
        let query;
        let token;

        if (bodyData.phoneNo) {
            query = {username: bodyData.phoneNo}
        } else {
            query = {username: bodyData.email}
        }

        const userExists = await User.findOne(query).lean();

        if (userExists) {
            const error = new Error(`A user with this ${bodyData.phoneNo ? 'Phone' : 'Email'} no already registered!`);
            error.statusCode = 406;
            next(error);
        } else {
            const password = bodyData.password;
            const hashedPass = bcrypt.hashSync(password, 8);
            const registrationData = {...bodyData, ...{password: hashedPass}}
            const user = new User(registrationData);

            const newUser = await user.save();

            token = jwt.sign({
                    username: newUser.username,
                    userId: newUser._id
                },
                process.env.JWT_PRIVATE_KEY, {
                    expiresIn: '24h'
                }
            );

            res.status(200).json({
                token: token,
                expiredIn: 86400
            })
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


// Login User..
exports.userLoginDefault = async (req, res, next) => {

    try {
        const username = req.body.username;
        const password = req.body.password;

        let loadedUser;
        let token;
        const user = await User.findOne({username: username})

        if (!user) {
            const error = new Error('A User with this phone or email no could not be found!');
            error.statusCode = 401;
            next(error)
        } else if (user.hasAccess === false) {
            const error = new Error('Ban! Your account has been banned');
            error.statusCode = 401;
            next(error);
        } else {
            loadedUser = user;
            const isEqual = await bcrypt.compareSync(password, user.password);
            if (!isEqual) {
                const error = new Error('You entered a wrong password!');
                error.statusCode = 401;
                next(error)
            } else {
                token = jwt.sign({
                        username: loadedUser.username,
                        userId: loadedUser._id
                    },
                    process.env.JWT_PRIVATE_KEY, {
                        expiresIn: '24h'
                    }
                );
                res.status(200).json({
                    token: token,
                    expiredIn: 86400
                })
            }

        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getLoginUserInfo = async (req, res, next) => {
    try {
        const loginUserId = req.userData.userId;
        const selectString = req.query.select;

        let user;

        if (selectString) {
            user = User.findById(loginUserId).select(selectString)
        } else {
            user = User.findById(loginUserId).select('-password')
        }
        const data = await user;

        res.status(200).json({
            data: data,
            message: 'Successfully Get user info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editLoggedInUserData = async (req, res, next) => {
    try {

        console.log(req.body);

        const id = req.userData.userId;
        console.log(id);

        await User.findOneAndUpdate({_id: id}, req.body);

        res.status(200).json({
            message: 'Info Updated Successfully!'
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

exports.editUserByAdmin = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const userId = req.params.id;

        await User.updateOne(
            {_id: userId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'User data updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getUserDetailsInfoByAdmin = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('-password -wishlists')
            .populate({
                path: 'carts',
                select: '-userId -updatedAt',
                populate: {
                    path: 'book',
                    select: 'name slug categoryName image price discountPercent priceData',
                    model: 'Book'
                }
            })
            .populate('orders', 'subTotal shippingFee discount totalAmount paymentStatus paymentMethod checkoutDate')

        res.status(200).json({
            data: user,
            message: 'Successfully Get user info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * USER CONTROL BY ADMIN
 */
exports.getUserLists = async (req, res, next) => {
    try {
        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;
        const filter = req.body

        console.log('this is filter data')
        console.log(req.body)

        let queryData;
        if (filter) {
            queryData = User.find(filter).populate('checkouts', '-sessionKey').sort({rewardPoints: 1});
        } else if (filter) {
            queryData = User.find(filter).populate('checkouts', '-sessionKey').sort({purchasedAmount: 1});
        } else{
            queryData = User.find().populate('checkouts', '-sessionKey');
        }

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData;
        const dataCount = await User.countDocuments();

        // for (let i of data.checkouts) {
        //     console.log(i.totalAmountWithDiscount)
        // }
        for (let user of data) {
            let totalAmount = 0

            // console.log(' ')
            // console.log('User Data')
            // console.log(user._id)
            // console.log(user.fullName)
            // data = checkouts.map(i => i.totalAmountWithDiscount)
            // console.log(checkouts.map(i => i.totalAmountWithDiscount))
            // console.log(user.checkouts)
            // console.log('Chekout Gap')

            for (let data of user.checkouts) {
                // console.log(data.totalAmountWithDiscount)
                totalAmount = totalAmount + data.totalAmountWithDiscount
            }
            // console.log('this is', user.fullName, 'Totall Amount')
            // console.log(totalAmount)
            user.purchasedAmount = totalAmount

            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user}
            );

            // console.log(user.purchasedAmount)

        }

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'All User fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}






exports.deleteAllCartItem = async (req, res, next) => {
  
    try {
        await Cart.deleteMany({})
        await User.updateMany({}, {$set: {carts: []}})

        res.status(200).json({
            success: true,
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


exports.getUserByUserId = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const userId = req.params.userId;
    const user = await User.findOne({_id: userId})
    .populate(
        {
            path: 'wishlists -_id',
            populate: {
                path: 'book',
                select: '_id name slug image price discountPercent availableQuantity author authorName publisherName companyName companySlug'
            }
        })
        .populate(
            {
                path: 'carts -_id',
                populate: {
                    path: 'product',
                    select: '_id name slug image price discountPercent availableQuantity author authorName publisherName companyName companySlug',
                    populate: {
                        path: 'priceData',
                        model: 'PriceDataExtra'
                    }
                }
            })    

    try {
        res.status(200).json({
            data: user,
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
 * USER ADDRESS
 */
exports.getAllAddress = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const addresses = await User.findOne({_id: userId}, {address: 1})

        res.status(200).json({
            data: addresses.address
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

// ADD USER ADDRESS
exports.addToAddress = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const userId = req.userData.userId;
    const data = req.body;

    try {

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                address: data
            }
        })
        res.status(200).json({
            message: 'Added to Address Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// EDIT USER ADDRESS
exports.editAddress = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const userId = req.userData.userId;
    const id = req.params.addressId;
    const data = req.body;

    try {
        await User.findOneAndUpdate(
            {"_id": userId, "address._id": id},
            {
                "$set": {
                    "address.$": data
                }
            }
        );

        res.status(200).json({
            message: 'Edited Address Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// DELETE USER ADDRESS
exports.deleteAddress = async (req, res, next) => {

    const userId = req.userData.userId;
    1
    const id = req.params.addressId;

    try {

        await User.findOneAndUpdate({_id: userId}, {
            "$pull": {address: {_id: id}}
        })

        res.status(200).json({
            message: 'Deleted Address Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editPassword = async (req, res, next) => {
    const phoneNo = req.body.phoneNo;
    const hashedPass = bcrypt.hashSync(req.body.password, 8);

    try {

        await User.findOneAndUpdate({phoneNo: phoneNo}, {$set: {password: hashedPass}});

        res.status(200).json({
            message: 'Password Reset Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updatePassword = async (req, res, next) => {

    const userId = req.userData.userId;

    try {
        const userData = await User.findOne({_id: userId}).select('password');

        const isEqual = await bcrypt.compareSync(req.body.oldPassword, userData.password);

        if (isEqual) {
            const newPassword = bcrypt.hashSync(req.body.newPassword, 8);
            await User.findOneAndUpdate({_id: userId}, {$set: {password: newPassword}});
            // message = "Password Reset Successfully!"
            res.status(200).json({
                message: "Password Reset Successfully!"
            });
        } else {
            const error = new Error('Your old Password is Wrong!');
            error.statusCode = 401;
            next(error)
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.checkUserByPhone = async (req, res, next) => {

    // const userId = req.userData.userId;
    const phoneNo = req.params.phoneNo;

    try {

        if (await User.findOne({phoneNo: phoneNo})) {
            res.status(200).json({
                data: true,
                message: 'Check Your Phone & Enter OTP Below!'
            });
        } else {
            res.status(200).json({
                data: false,
                message: 'No Account Exists With This Phone Number!'
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


/**
 * Phone Verification Data
 */

exports.updatePhoneVerificationStatus = async (req, res, next) => {
    try {
        const userId = req.userData.userId;
        const isPhoneVerified = req.body.isPhoneVerified;
        const data = {$set: {isPhoneVerified: isPhoneVerified}}

        await User.findByIdAndUpdate(userId, data);

        res.status(200).json({
            message: 'Phone verification success'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editUserAccess = async (req, res, next) => {

    try {
        const bodyData = req.body;
        const userId = req.params.id;

        await User.updateOne(
            {_id: userId},
            {$set: bodyData}
        )
        res.status(200).json({
            message: 'User Access updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

