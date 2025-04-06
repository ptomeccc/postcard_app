const mongoose = require("mongoose");

const folderSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Postcard" }],
});

const Folder = mongoose.model("Folder", folderSchema);

export default folderSchema;
