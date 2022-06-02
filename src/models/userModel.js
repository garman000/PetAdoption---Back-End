import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: Number, required: true },
    password: { type: String, required: true, minlength: 6 },
    pets: [{
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Pets",
    }],
    role: { type: String, required: false, default: "user" },
    isAdmin: {type: Boolean, required: false, default: false},
    // confirmPassword: { type: String, required: true, minlength: 6 },
    bio: { type: String, required: false },
    
     
  },
 
  {
    collection: "users",
  }
);

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
