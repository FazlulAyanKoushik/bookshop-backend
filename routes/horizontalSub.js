const express = require("express");
const { addHorizontalSub, getHorizontalSubs, editHorizontalSub, deleteHorizontalSub, editHorizontalSubPriority, getHorizontalSub, deleteOneHorizontalSub } = require("../controller/horizontalSub");

const router = express.Router({ mergeParams: true });


const checkAdminAuth = require('../middileware/check-admin-auth');

/**
 * /api/horizontalSub
 * http://localhost:3000/api/horizontalSub
 */

//CRUD
router.get("/get-horizontal-sub-categroy/:id",getHorizontalSub);
router.get("/get-all-horizontal-sub-categroies",getHorizontalSubs)
router.post("/add-horizontal-sub-categroy",addHorizontalSub);
router.put("/edit-horizontal-sub-categroy/:id",editHorizontalSub)
router.delete("/delete-horizontal-sub-categroy/:id",deleteHorizontalSub);
router.delete("/delete-one-from-horizontal-sub-categroy/:id/:subId",deleteOneHorizontalSub);

//set priority
router.put("/set-horizontal-sub-categroy-priority/:id",editHorizontalSubPriority);



module.exports=router;