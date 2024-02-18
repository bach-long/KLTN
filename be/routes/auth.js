const express = require('express');
const router = express.Router();
const { User, Document } = require('../models');
const {validationResult} = require('express-validator');
const { validate } = require('../validators/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const saltRounds = 10;
const createFolder = require('../services/createFolder');
const {sequelize} = require('../models');

dotenv.config();

router.post('/login', validate.validateLogin(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Dữ liệu không hợp lệ")
    }

    const user = await User.findOne({
      where: {
        username: req.body.username,
      }
    });
    if(!user) {
      res.status(403).json({success: 0, message: "Thông tin đăng nhập sai"})
    }
    const match = await bcrypt.compare(req.body.password, user.password)
    if(!match) {
      res.status(403).json({success: 0, message: "Thông tin đăng nhập sai"})
    }

    const token = jwt.sign({id: user.id,...user.dataValues}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "2 days"})
    res.status(202).json({success: 1, message: "Đăng nhập thành công", data: {user, token}})
  } catch (error) {
    res.status(503).json({success: 0, message: error.message})
  }
});

router.post('/signup', validate.validateRegisterUser(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Dữ liệu không hợp lệ")
    }
    const result = await sequelize.transaction(async (t) => {

      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds)
      }, {transaction: t});

      await createFolder(process.env.BUCKET_NAME, `${user.id}/trash/`);

      const document = await Document.create({
        name: `${user.id}`,
        type: "folder",
        user_id: user.id,
      }, {transaction: t});

      return user;

    });


    res.status(200).json({success: 1, message: "Đăng ký thành công", data: result})
  } catch (error) {
    res.status(503).json({success: 0, message: error.message})
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = jwt.verify(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)

    if (!token) {
      res.status(403).json({success: 0, message: 'Thông tin đăng nhập sai'})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) {
        res.status(403).json({success: 0, message: 'Thông tin đăng nhập sai'})
      }
      res.status(200).json({success: 1, message: "Lấy thông tin user thành công", data: user})
    })
  } catch (error) {
    res.status(503).json({success: 0, message: error.message})
  }
});

module.exports = router;
