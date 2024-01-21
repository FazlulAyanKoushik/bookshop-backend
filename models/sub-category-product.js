const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        subCategory:{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        slug:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        priority: {
            type: Number,
            required: false
        },
        books: [subSchema.onSaleProduct]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('SubCategoryProduct', schema);
