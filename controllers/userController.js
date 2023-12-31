const User = require("../models/userModels");
const bycrptjs = require("bcryptjs");
const config = require("../config/config");

const jwt = require('jsonwebtoken')
const securePassword = async (password) => {
  try {
    const passwordHash = await bycrptjs.hash(password, 10);

    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const comparePassword = async (password) => {

}
const register_user = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      image: req.file.filename,
      mobile: req.body.mobile,
      type: req.body.type,
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      return res
        .status(201)
        .send({ success: false, msg: "This email aready exists ! " });
    } else {
      const user_data = await user.save();
      return res.status(201).send({ success: true, data: user_data });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const create_token = async (id) => {
  try {
    const tokent = await jwt.sign({ _id: id }, config.secret_jwt)
    return tokent;
  } catch (error) {
    res.status(400).send(error.message);
  }
}
const login_user = async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(422).send({ success: false, msg: 'The email field is required.' });
    }

    else if (!password) {
      return res.status(422).send({ success: false, msg: 'The password field is required.' });
    }

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bycrptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokentData = await create_token(userData._id);

        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          image: 'http://localhost:3000/userImages/' + userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token_type: 'Bearer',
          tokent: tokentData,
        }

        return res.status(200).send({ success: false, msg: 'Login Successfully', 'data': userResult });
      } else {
        return res.status(200).send({ success: false, msg: 'Login details are incorrect' });
      }
    } else {
      return res.status(200).send({ success: false, msg: 'Login details are incorrect' });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}


//=============update password =================//


const update_password = async (req, res) => {

  try {
    const userId = req._id;

    const data = await User.findOne({ _id: userId });
    if (data) {
      const passwordHash = await securePassword(req.body.password)
      const userData = await User.findByIdAndUpdate({ _id: userId }, {
        $set: {
          password: passwordHash
        }
      });
      res.status(200).send({ success: true, msg: 'Your Pass has been Update Successfully' })
    } else {

      res.status(200).send({ success: false, msg: 'User Id not found!' })
    }

  } catch (error) {
    res.status(200).send(error.message)
  }
}

module.exports = {
  register_user,
  login_user,
  update_password,
};
