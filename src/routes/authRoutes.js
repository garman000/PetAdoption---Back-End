import express from "express";
import authController from "../controllers/authController.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").not().isEmpty(),
    check("phonenumber").isInt(true),
    check("password").isLength({ min: 6 }),
    // check("role").not().isEmpty()
    // check("confrimPassword").isLength({ min: 6 }),
  ],
  authController.signUp
);

router.post("/login", authController.login);
// router.put("/updateUser", authController. updateUser);
// router.put("/update", authController)
// router.get("/signup", authController.createToken);

export default router;
