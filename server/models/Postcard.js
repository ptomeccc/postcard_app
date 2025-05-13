import mongoose from "mongoose";

const postcardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  photos: {
    type: [String],
    require: false,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
});

const Postcard = mongoose.model("Postcard", postcardSchema);

export default Postcard;
