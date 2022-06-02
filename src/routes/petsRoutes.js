import express from "express";
import { check } from "express-validator";
import multer from "multer";
import petsController from "../controllers/petsController.js";
import uploadCloudinary from "../middlewares/cloudinary.js";
// import tokenRoutes from "../middlewares/check-auth.js";
import fileUpload from "../middlewares/file-upload.js";

const router = express.Router();

router.post(
  "/",
  fileUpload.single('image'), uploadCloudinary,
  [
    check("type").not().isEmpty(),
    check("name").not().isEmpty(),
    check("status").not().isEmpty(),
    check("picture").not().isEmpty(),
    check("height").isInt(true),
    check("weight").isInt(true),
    check("color").not().isEmpty(),
    check("bio").not().isEmpty(),
    check("hypoallergenic").not().isEmpty(),
    check("dietaryrequirements").not().isEmpty(),
    check("breed").not().isEmpty(),
    check("savedby").not().isEmpty(),
    // check("image").not().isEmpty()
  ], 
  petsController.addPet
);
router.get("/", petsController.getPet);
router.get(
  "/search", petsController.getPetByQuery
)

router.get("/:pid", petsController.getPetById);
router.get("/pet/:pid", petsController.getPetById);
router.get("/user/:uid", petsController.getPetsByUserId);
router.get("/pet/:id", petsController.getidpet);

// router.use(tokenRoutes);


router.post(
  "/:uid/save",
  [check("_id").not().isEmpty()],
  petsController.savePet
);

router.delete(
  "/:uid/save",
  [check("_id").not().isEmpty()],
  petsController.removePet
)
router.delete("/:uid/return",
// [[check("_id").not().isEmpty()],
petsController.cancelAdoption)

router.post(
  "/:uid/fostered",
  [check("status").not().isEmpty(), check("owner").not().isEmpty()],
  petsController.fostered
);
router.post(
  "/:uid/adopt",
  petsController.sendPetId
);
router.post(
  "/:uid/adopted",
  petsController.adopted
);

router.put(
  "/:pid/update", petsController.adopted
)


router.put(
  "/:pid",
  [
    check("type").not().isEmpty(),
    check("name").not().isEmpty(),
    check("status").not().isEmpty(),
    check("picture").not().isEmpty(),
    check("height").isInt(true),
    check("weight").isInt(true),
    check("color").not().isEmpty(),
    check("bio").not().isEmpty(),
    check("hypoallergenic").not().isEmpty(),
    check("dietaryrequirements").not().isEmpty(),
    check("breed").not().isEmpty(),
    // check("image").not().isEmpty()
  ],
  petsController.updatePet
);

router.delete("/:pid/", petsController.deletePet);

export default router;
