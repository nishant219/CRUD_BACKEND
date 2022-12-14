const User = require("../models/user");
const { validationResult } = require("express-validator");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");



exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "not able to save user in db",
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};


exports.signin = (req, res) => {
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
    return  res.status(400).json({
        error: "User email does not exist",
      });
    }
    if (!user.autheticate(password)) {
      return res.status().json({
        error: "Email and password does not matched",
      });
    }
 
    const token = jwt.signin({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({token,user:{_id,name,email,role} });

  });
};


exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout sucessfully"
  });
};


exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: "auth"
});


exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id === req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error:"Acess Denied"
    })
   }
  next();
}
 

exports.isAdmin = (req,res,next) => { 
  if (req.profile.role === 0) {
    return res.status(403).json({
      error:"You are not aadmin"
    })
   }

  next();
}