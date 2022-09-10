var express = require("express");
var router = express.Router();
const { check } = require('express-validator');
// const { body, validationResult } = require('express-validator');
const { signout ,signup, signin} = require("../controllers/auth");


router.post("/signup", [
    check("name","name should be atleast of 3 char").isLength({min:3}),
    check("email","Email is required").isEmail(),
    check("password", "Password should be of min 5 char").isLength({min:5})
] ,signup);


router.post("/signin", [
    check("email","Email is required").isEmail(),
    check("password", "Password Required").isLength({min:3})
] ,signin);



router.get("/signout", signout);





module.exports = router;