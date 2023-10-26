const User = require("../models/userModels");
const bycrptjs = require("bcryptjs");

const securePassword = async (password) => {
  try {
    const passwordHash = await bycrptjs.hash(password, 10);

    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const register_user = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      image: req.file.filename,
      type: req.body.type,
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res
        .status(201)
        .send({ success: false, msg: "This email aready exists ! " });
    } else {
      const user_data = await user.save();
      res.status(201).send({ success: true, data: user_data });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  register_user,
};
