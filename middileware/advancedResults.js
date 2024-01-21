const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };



  const removeFields = ['select', 'sort', 'page', 'limit'];
  // console.log(reqQuery);

  removeFields.forEach(param => delete reqQuery[param]);
  //console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);


  //console.log(queryStr);


  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|eq|ne|nin)\b/g, match => `$${match}`)



  //..............JUST FOR GET BOOTCAMPS.......................
  //..............GET BOOTCAMPS/Model WITH THESE QUERIES gt|gte|lt|lte|in|eq|ne|nin..................


  query = model.find(JSON.parse(queryStr));

  //...........IF THERE IS ANY SELECT QUEARY................
  //........../api/v1/bootcamp?select=name,decription etc...............

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    //console.log(fields);
    query = query.select(fields);

  }
  //.............IF THERE IS ANY SORTING ............

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    //console.log(sortBy);
    query = query.sort(sortBy);
  }
  else {
    query = query.sort('-createdAt');
  }

  //pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  //console.log(total, startIndex, endIndex);

  query = query.skip(startIndex).limit(limit);

  // if (populate) {
  //   query = query.populate(populate);
  // }

  const results = await query;

  const pagination = {
    next: {},
    prev: {}
  };


  if (endIndex < total) {

    pagination.next = {
      page: page + 1,
      limit: limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    }
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination: pagination,
    data: results
  }
  next();
}
module.exports = advancedResults;