const express = require('express');
const meeting = require("./meeting");
const router = express.Router();
const auth = require("../../middelwares/auth");

router.get("/", auth, meeting.index);
router.post("/add", auth, meeting.add);
router.get("/view/:id", auth, meeting.view);
router.delete("/delete/:id", auth, meeting.deleteData);
router.post("/deleteMany", auth, meeting.deleteMany);

module.exports = router