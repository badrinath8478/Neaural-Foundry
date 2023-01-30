const express = require("express");
const router = express.Router();
const MovieController = require("../controller/movie");
const isAuth = require("../middleware/auth");

router.post("/add", isAuth, MovieController.addMovie);
router.get("/get", isAuth, MovieController.getMovie);

module.exports = router;
