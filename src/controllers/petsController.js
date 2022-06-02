import Pets from "../models/petModel.js";
import User from "../models/userModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error.js";


const addPet = async (req, res, next) => {
 
  const {
    type,
    name,
    breed,
    weight,
    height,
    color,
    dietaryrequirements,
    hypoallergenic,
    bio,
    picture,
    status,
    // savedby,
    // image,
  } = req.body;
  const createdPet = new Pets({
    type,
    name,
    breed,
    weight,
    height,
    color,
    dietaryrequirements,
    hypoallergenic,
    bio,
    picture,
    status,
    // savedby,
    image: req.body.uploadResult
    
  });


  try {
    console.log(createdPet)
    const pet = await createdPet.save()
    console.log(pet)
  } catch (err) {
    console.log(err)
    const error = new HttpError("Something went wrong couldnt add a pet", 500);
    return next(error);
  }
  
    if (!createdPet) {
      const error = new HttpError(
        "Could not create a pet ",
        404
      );
      return next(error);
    }
    res.json({ createdPet: createdPet.toObject({ getters: true }) })
  }

const getPetById = async (req, res, next) => {
  const petId = req.params.pid;
  
  let pet;
  try {
    pet = await Pets.findById(petId);
  } catch (err) {
    const error = new HttpError("Something went wrong couldnt find a pet", 500);
    return next(error);
  }

  if (!pet) {
    const error = new HttpError(
      "Could not find a pet with the correct id",
      404
    );
    return next(error);
  }
  res.json({ pet: pet.toObject({ getters: true }) });
};
const getidpet = async (req, res, next) => {
  const id = req.params.id;
  
  let pet;
  try {
    pet = await Pets.findById(id);
  } catch (err) {
    const error = new HttpError("Something went wrong couldnt find a pet", 500);
    return next(error);
  }

  if (!pet) {
    const error = new HttpError(
      "Could not find a pet with the correct id",
      404
    );
    return next(error);
  }
  res.json({ pet: pet.toObject({ getters: true }) });
};

const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPets;
  try {
    userWithPets = await User.findById(userId).populate("pets");
    
  } catch (err) {
    const error = new HttpError("Fetching pets stop test failed, try again soon!", 500);
    return next(error);
  }
  if (!userWithPets || userWithPets.pets.length === 0) {
    return next(
      new HttpError("You have no pet, why not adopt?", 404)
    );
  }
  res.json({
    pets: userWithPets.pets.map((pets) => pets.toObject({ getters: true })),
  });
};

const deletePet = async (req, res, next) => {
  const petId = req.params.pid;
  let pet;
  try {
    pet = await Pets.findById(petId).populate("savedby");
  
  } catch (err) {
    const error = new HttpError('Ooops, something went wrong, couldnt delete pet!', 500);
    return next(error)
  }
  if (!pet) {
    const error = new HttpError('Could not find pet!', 404);
    return next(error)
  }
  try {
    await pet.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Pet.' });
};
  
const getPet = async (req, res, next) => {
  const {name, status, weight, height} = req.query;

  let pets;
  try {
    pets = await Pets.find({});
  } catch (err) {
    const error = new HttpError('Fetching failed, please try again later.', 500);
    return next(error);
  }
  res.json({ pets: pets.map(pet => pet.toObject({ getters: true}))})
};


const updatePet = async(req, res, next) => {
  const errors = validationResult(req);
  
const { type, name, status, picture, height, weight, color, bio, hypoallergenic, dietaryrequirements, breed, image } = req.body;
const petId = req.params.pid;

let pet;
try {
  pet = await Pets.findByIdAndUpdate(petId, {
    type,
    name,
    status,
    picture,
    height,
    weight,
    color,
    bio,
    hypoallergenic,
    dietaryrequirements,
    breed,
    image
  });

} catch (err) {
  const error = new HttpError(
    "Something went wrong couldnt update pet!", 500
  );
  return next(erorr)
}

res.status(200).json({
  pet: pet.toObject({ getters: true }),
  message: "pet has been updated",
})
}

 const fostered = async(req, res, next) => {
  const errors = validationResult(req);
  
  const userId  = req.body;
  const petId = req.params;
  const finalUserId = String(Object.values(userId)[0]);
  const finalPetId = String(Object.values(petId)[0]);

  console.log("petId", petId)
  console.log("userId", userId)
  console.log("finalUserId", finalUserId)
  console.log("finalPetId", finalPetId)


  let userWithAdoptedPet;
  try {
    userWithAdoptedPet = await Pets.findByIdAndUpdate(finalPetId,{
      savedby: finalUserId,
      status: "Fostered"
    });

  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not update user",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({
      // pet: Pets.toObject(),
      message: "fostered pets",
    });
}

const sendPetId =  async (req, res, next) => {
  const errors = validationResult(req);
  const {_id} = req.body;
  
  const savedPet = new Pets({_id});
  let user;
  let pet;
  const status = "Adopted";
  try {
    user = await User.findById(req.params.uid);
    // console.log(user)
    pet = await Pets.findById(savedPet._id);
    
   
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  // console.log('savedby test', savedby)
  try {
    pet.savedby.push(req.params.uid);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    await Pets.findByIdAndUpdate(savedPet.id, pet, { new: true });
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ pets: savedPet });
};

const adopted = async(req, res, next) => {
  const errors = validationResult(req);
  
  const {_id}  = req.body;
  const petsId = req.params.id;
/*   const finalUserId = String(Object.values(userId)[0]);
  const finalPetId = String(Object.values(petId)[0]); */

  console.log("petId", _id)
  // console.log("userId", userId)
  // userWithAdoptedPet = await Pets.findByIdAndUpdate(finalPetId,{
  //   savedby: finalUserId,
  //   status: "Fostered"
  
  let userWithAdoptedPet;
  try {
    userWithAdoptedPet = await User.findByIdAndUpdate(petsId),{
      pets: petsId,
      // status: "Adopted"
    }, {new: true};
    
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not update user",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({
      // pet: Pets.toObject(),
      message: "adopted pets",
    });
}

const savePet = async (req, res, next) => {
  const errors = validationResult(req);
  const {_id} = req.body;
  console.log(_id)
  // console.log(req.body)

  const savedPet = new Pets({_id});

  let user;
  let pet;
  try {
    user = await User.findById(req.params.uid);
    // console.log(user)
    pet = await Pets.findById(savedPet._id);
    
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    user.pets.push(savedPet.id);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    await Pets.findByIdAndUpdate(savedPet._id, pet, { new: true });
    
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ pets: savedPet });
};

const removePet = async (req, res, next) => {
  const errors = validationResult(req);
  const {_id} = req.body;
  // console.log(_id)
  // console.log(req.body)

  const savedPet = new Pets({_id});

  let user;
  let pet;
  try {
    user = await User.findById(req.params.uid);
    // console.log(user)
    pet = await Pets.findById(savedPet._id);
    
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.1", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  if (!pet) {
    const error = new HttpError("Could not find pet for provided id", 404);
    return next(error);
  }
  try {
    user.pets.pull(savedPet.id);
    await User.findByIdAndUpdate(req.params.uid, user, { new: true });
    /*     await Pet.findByIdAndUpdate(savedPet._id, pet, { new: true });
     */
  } catch (err) {
    const error = new HttpError("Saving pet failed, please try again.2", 500);
    return next(error);
  }

  res.status(201).json({ pets: savedPet });
};
  

const getPetByQuery = async (req, res, next) => {
  const { type, status, name, height, weight } = req.query;

  let pets;
  try {
      for( let key in req.query) {
        if(req.query[key] === ""){
          delete req.query[key]
        }

      }

      pets = await Pets.find(req.query)
  } catch (err) {
  const error = new HttpError("Cannot perform query", 500)
  return next(error);

} 
res.json({
  pets: pets.map((pet) => pet.toObject({ getters: true })),

})
}

const cancelAdoption = async(req, res, next) => {
    const errors = validationResult(req);
    const userId  = req.body;
    const petId = req.params;
    const finalUserId = String(Object.values(userId)[0]);
    const finalPetId = String(Object.values(petId)[0]);
console.log("petid",finalPetId)  
    let user;
    let pet;

    try {
      // user = await User.findById(req.params.uid);
      // console.log(user)
      pet = await Pets.findByIdAndUpdate(finalPetId,{
        savedby: userId,
        status: "Available"
      });
      
    res.status(201).json({ message: "Returned" });
    } catch (err) {
      console.log(err)
    }
    
  };



export default {
  addPet,
  getPetById,
  getPetsByUserId,
  deletePet,
  getPet,
  savePet,
  updatePet,
  getidpet,
  fostered,
  adopted,
  getPetByQuery,
  removePet, 
  sendPetId,
  cancelAdoption
};
