import mongoose from "mongoose";

const PostcardSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
});

const PostcardModel = mongoose.model("postcards", PostcardSchema);

export default PostcardModel;
