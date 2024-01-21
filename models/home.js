const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    categoryId:{
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    category:{
      type:String,
      required:true
    },
    slug:{
      type:String,
      required:true
    },
    title:{
      type:String,
      required:true
    },
    books:[
       {
        type: Schema.Types.ObjectId,
        ref: 'Book'
      },
    ]
},
{
  timestamps: true
}
);


module.exports = mongoose.model('Home', schema);
