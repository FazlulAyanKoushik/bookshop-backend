const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        priority:{
          type:Number,
          required:true
        },

        numOfRows:{
          type:Number,
          required:false
        },

        numOfSubsInRows:{
          type:Number,
          required:[false, "Number of sub categories should be greater than 1"]
        },

        subCategories: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            required:true
        }]
    },
    {
      timestamps: true
    }
)

module.exports = mongoose.model('HorizontalSubCategory', schema);
