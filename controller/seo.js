const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Seo = require('../models/seo');

/**
 * Add Publisher
 * Get Publisher List
 */
 exports.getASingleAuthorSEO= async (req, res, next) => {

    try {
        const data = await Seo.findOne({pageName: 'AUTHORS'}, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , pageName: '$pageName'});
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

exports.getASinglePublisherSEO= async (req, res, next) => {

    try {
        const data = await Seo.findOne({pageName: 'PUBLISHERS'}, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , pageName: '$pageName'});
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

exports.getASingleContactSEO= async (req, res, next) => {

    try {
        const data = await Seo.findOne({pageName: 'CONTACT_US'}, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$pageName'});
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
exports.getASingleAboutUsSEO= async (req, res, next) => {

    try {
        const data = await Seo.findOne({pageName: 'ABOUT_US'}, {imgUrl: 1, keyword: 1, metaDesc:1, metaTag: 1 , title: '$pageName'});
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

exports.addNewSEO = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {

        const data = new Seo(req.body);
        await data.save();

        res.status(200).json({
            message: 'SEO Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllSEO = async (req, res, next) => {

    console.log('res',res);
    try {
        const result = await Seo.find();
         console.log('result',result);
        res.status(200).json({
            data: result,
            message: 'All SEO Data fetched Successfully!'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
        console.log('err',err);
    }

}

exports.getASingleSEoById= async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Seo.findOne(query);
        res.status(200).json({
            data: data,
            message: 'SEO fetched Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleSEOBySlug = async (req, res, next) => {
    const publisherSlug = req.params.slug;
    const query = {slug: publisherSlug}

    try {
        const data = await Seo.findOne(query);
        res.status(200).json({
            data: data,
            message: 'SEO Data fetched Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteSEOById = async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await Seo.deleteOne(query);
        res.status(200).json({
            data: data,
            message: 'SEO Data deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editSEOData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const push = { $set: updatedData }

    try {
        // await Seo.updateMany({subCategory: updatedData._id}, {$set: {subCatName: updatedData.subCatName, subCatSlug: updatedData.slug}});
        await Seo.findOneAndUpdate({_id: updatedData._id}, push);
        res.status(200).json({
            message: 'Seo Data Updated Successfully!'
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

// exports.getSubCategoryFilter = async (req, res, next) => {

//     try {
//         const slug = req.params.slug;

//         const result = await SubCategory.findOne({slug: slug}).select('filters priceRange -_id');
//         res.status(200).json({
//             data: result
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }


