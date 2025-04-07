import mongoose from "mongoose";

const postcardSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  photos: {
    type: [String],
    require: false,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
});

const Postcard = mongoose.model("Postcard", postcardSchema);

export default Postcard;
