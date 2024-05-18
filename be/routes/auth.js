const express = require("express");
const router = express.Router();
const { User, Document } = require("../models");
const { validationResult } = require("express-validator");
const { validate } = require("../validators/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const saltRounds = 10;
const createFolder = require("../services/createFolder");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const queue = require("../jobs/mailJob");

dotenv.config();

router.post("/login", validate.validateLogin(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Dữ liệu không hợp lệ");
    }

    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      res.status(403).json({ success: 0, message: "Thông tin đăng nhập sai" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(403).json({ success: 0, message: "Thông tin đăng nhập sai" });
    }

    const token = jwt.sign(
      { id: user.id, ...user.dataValues },
      process.env.ACCESS_TOKEN_SECRET
    );
    res
      .status(202)
      .json({
        success: 1,
        message: "Đăng nhập thành công",
        data: { user, token },
      });
  } catch (error) {
    res.status(503).json({ success: 0, message: error.message });
  }
});

router.get("/active/:token", async (req, res) => {
  try {
    console.log(req.params.token);
    const [result] = await sequelize.query(
      `UPDATE users
      SET activated_at = NOW()
      WHERE active_token = :token
      AND activated_at is NULL
      AND active_sent_at > DATE_SUB(NOW(), INTERVAL 1 DAY)`,
      { replacements: { token: req.params.token } }
    );
    if (result.changedRows === 1) {
      console.log(result);
      res.redirect(`http://localhost:5173/active/${req.params.token}`);
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/token/:token", async (req, res) => {
  const user = await User.findOne({
    where: {
      active_token: req.params.token,
      activated_at: {
        [Op.not]: null,
      },
    },
  });

  if (user) {
    res.json({ success: 1, message: "Tài khoản của bạn đã được kích hoạt" });
  } else {
    res.json({ success: 0, message: "Token không hợp lệ" });
  }
});

router.post("/signup", validate.validateRegisterUser(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    const result = await sequelize.transaction(async (t) => {
      const hashToken = bcrypt.hashSync(
        Math.random().toString(36).substring(2),
        saltRounds
      );
      const activeToken = Buffer.from(hashToken)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const user = await User.create(
        {
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, saltRounds),
          active_token: activeToken,
          active_sent_at: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        { transaction: t }
      );

      queue.add({
        to: user.email,
        subject: "Kích hoạt tài khoản",
        text: `http://localhost:5000/auth/active/${user.active_token}`,
      });

      const check = await createFolder(user.id);
      if (!check) {
        throw new Error("Thất bại khi tạo folder");
      }
      return user;
    });
    res
      .status(200)
      .json({ success: 1, message: "Đăng ký thành công", data: result });
  } catch (error) {
    res.status(503).json({ success: 0, message: error.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = jwt.verify(
      authHeader.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!token) {
      res.status(403).json({ success: 0, message: "Thông tin đăng nhập sai" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res
          .status(403)
          .json({ success: 0, message: "Thông tin đăng nhập sai" });
      }
      res
        .status(200)
        .json({
          success: 1,
          message: "Lấy thông tin user thành công",
          data: user,
        });
    });
  } catch (error) {
    res.status(503).json({ success: 0, message: error.message });
  }
});

module.exports = router;
