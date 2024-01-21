const express = require('express');
const {addHome, getAllHomes, getSingleHome, editHome, deleteHome, removeBook} = require('../controller/home');
const router = express.Router();

const checkAdminAuth = require('../middileware/check-admin-auth');


//POST
//api/home/add-home
//add home

router.post("/add-home", checkAdminAuth, addHome);
// router.post("/add-home", addHome);

//GET
//api/home/get-all-homes
//get all home

router.get("/get-all-homes", getAllHomes);
// router.get("/get-all-homes", getAllHomes);

//GET
//api/home/get-signle-home/:homeId
//get a single home

router.get("/get-single-home/:homeId", checkAdminAuth, getSingleHome);
// router.get("/get-single-home/:homeId", getSingleHome);

//PUT
//api/home/edit-home/:homeId
//edit a home
router.put("/edit-home", checkAdminAuth, editHome);
// router.put("/edit-home/:homeId", editHome);

//DELETE
//api/home/delete-home/:homeId
//delete a home
router.delete("/delete-home/:homeId", checkAdminAuth, deleteHome);
router.delete("/delete-single-book/:homeId/:bookId", checkAdminAuth, removeBook);
// router.delete("/delete-home/:homeId", deleteHome);

module.exports = router;
