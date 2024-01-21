const express = require("express");
const rewardController = require("../controller/reward");

const router = express.Router();
// const checkAuth = require('../middileware/check-user-auth');

// const checkAdminAuth = require('../middileware/check-admin-auth');


/**
 * /api/reward
 * http://localhost:3000/api/reward
 */


// Review and rating
// feature added by
// Al Mahmud
// Powered by Soft-lab-It

// GET
// get All reward of a book
// api/get-reward
router.get("/get-reward", rewardController.getReward);

//POST
//ADD A reward
//api/add-reward
router.post("/add-reward", rewardController.addReward);

// PUT
// EDIT A review
// /api/reviews/:reviewId
router.put("/update-reward", rewardController.updateReward);


module.exports = router;
