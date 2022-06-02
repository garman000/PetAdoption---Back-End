import express from "express";
import usersController from "../controllers/usersController.js";
import { check } from "express-validator";
import { appendFile } from "fs";
// import tokenRoutes from "../middlewares/check-auth.js";


const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:uid", usersController.getUserById);

// app.get("/token/:storage")

// router.use(tokenRoutes);

router.put("/:uid", [
    check('firstname')
    .not()
    .isEmpty(),
    check('lastname')
    .not()
    .isEmpty(),
    check('email')
    .not()
    .isEmpty(),
    check('password')
    .not()
    .isEmpty(),
    check('bio')
    .not()
    .isEmpty()
], usersController.updateUser);

export default router;