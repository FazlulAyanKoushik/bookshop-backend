const nodemailer = require("nodemailer");
const ContactUs = require('../models/contact-us');


exports.addContactUs = async (req, res, next) => {

    try {
        const data = req.body;
        const contactUs = new ContactUs(data);
        await contactUs.save();
        res.status(200).json({
            data: true,
            message: 'Contact Information Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllContactUs = async (req, res, next) => {

    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        let query = ContactUs.find();


        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }
        const newsletterCount = await ContactUs.countDocuments();

        const data = await query

        res.status(200).json({
            data: data,
            count: newsletterCount
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

exports.getContactUsById = async (req, res, next) => {

    try {
        const id = req.params.id;
        const data = await ContactUs.findOne({_id: id});

        res.status(200).json({
            data: data,
            message: 'Successfully Get data!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editContactUs = async (req, res, next) => {
    try {
        const updatedData = req.body;
        await ContactUs.updateOne({_id: updatedData._id}, {$set: updatedData})
        res.status(200).json({
            data: true,
            message: 'Store Information Updated Successfully!'
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


exports.deleteContactUsById = async (req, res, next) => {

    const id = req.params.id;
    await ContactUs.deleteOne({_id: id});

    try {
        res.status(200).json({
            message: 'Contact Info Deleted Successfully',
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
 * NODE MAIL
 */

exports.sentMailByNodemailer = async (req, res, next) => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            // port: 587,
            // secure: true,
            auth: {
                user: 'ehsanbookshop@gmail.com',
                pass: 'ehsan@159357',
            },
        });

        const info = await transporter.sendMail({
            from: 'ehsanbookshop@gmail.com', // sender address
            to: 'ikbal.sazib@gmail.com', // list of receivers
            subject: "Test mail from nodeJS", // Subject line
            text: "Hello this is text body", // plain text body
            html: "<b>Hello this is html body</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            data: "Message sent: %s " + info.messageId,
            message: 'Contact Information Added Successfully!'
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
