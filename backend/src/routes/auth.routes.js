const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/admin", authMiddleware.verifyToken,

    authMiddleware.authorize("superAdmin"),

    (req, res) => {

        res.json({

            success: true,

            message: "Welcome Admin!",

            user: req.user

        });

    }
);

module.exports = router;
