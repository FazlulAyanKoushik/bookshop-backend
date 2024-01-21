const HorizontalSub= require("../models/horizontalSub");

exports.addHorizontalSub=async(req,res,next)=>{
  try {
    const {body}=req;
    const horizontalSub = await HorizontalSub.create(body);

    res.json({
      data:horizontalSub,
      message:"Horizontal Subcategory is added"
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}

exports.getHorizontalSub=async(req,res,next)=>{

  const {id}=req.params;
  try {

    const horizontalSub = await HorizontalSub.findById(id).populate('subCategories','subCatName slug parentCategoryName');

    res.json({
      data:horizontalSub
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'
  }
  next(error);
  }
}

exports.getHorizontalSubs=async(req,res,next)=>{
  try {

    const horizontalSubs = await HorizontalSub.find()
        .populate('subCategories','subCatName slug parentCategoryName').sort({createdAt: -1});

    res.json({
      data:horizontalSubs,

    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}

exports.editHorizontalSub=async(req,res,next)=>{
  try {
    const {body}=req;
    const {id}=req.params;

    const horizontalSub = await HorizontalSub.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    horizontalSub.save();

    res.json({
      data:horizontalSub,
      message:"Horizontal Subcategory is edited"
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}

exports.deleteHorizontalSub=async(req,res,next)=>{
  try {

    const {id}=req.params;

    await HorizontalSub.findByIdAndDelete(id);



    res.json({

      message:"Horizontal Subcategory is deleted"
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}

exports.deleteOneHorizontalSub = async(req,res,next) => {
  try {

    const id=req.params.id;
    const subId=req.params.subId;

    await HorizontalSub.updateOne({_id: id}, {$pull: {subCategories: subId}});



    res.json({

      message:"Subcategory Removed From List!"
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}

exports.editHorizontalSubPriority=async(req,res,next)=>{
  try {
    const {priority}=req.body;
    const {id}=req.params;

    const horizontalSub = await HorizontalSub.findByIdAndUpdate(id,{
      $set:{
        priority:priority
      }
    }
    )
    res.json({
      data:horizontalSub,
      message:"Horizontal Subcategory Priority is edited"
    })

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Something went wrong on database operation!'

  }

  next(error);
  }
}
