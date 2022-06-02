import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true},
    picture: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    bio: { type: String, required: true },
    hypoallergenic: { type: String, required: true },
    dietaryrequirements: { type: String, required: true },
    breed: { type: String, required: true },
    savedby: [{
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"}],
    
    image: {}
    
  }
  
);

export default mongoose.model("Pets", petSchema);
