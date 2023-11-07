const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
const multer = require("multer");

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
      function (error, success) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

const user_controller = require("../controllers/userController");

const auth = require('../middlware/auth')
user_route.post(
  "/register",
  upload.single("image"),
  user_controller.register_user
);

user_route.post('/login', user_controller.login_user)

user_route.get('/test', auth, function (req, res) {
  res.status(200).send({ success: true, msg: "Authenticated" })
})

user_route.post('/update_password', auth, user_controller.update_password);


user_route.post('/logout', (req, res) => {
  const token = req.body.token || req.query.token || req.headers['authorization'] || req.get('Authorization');

  if (token) {
    // Add the token to the blacklist
    tokenBlacklist.add(token);
  }

  res.json({ message: 'Logout successful' });
});
user_route.set('tokenBlacklist', new Set());
module.exports = user_route;
