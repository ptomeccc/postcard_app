import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
});

userSchema.pre("save", async function (next) {
  if ((this.isNew || this, isModified("password"))) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default userSchema;
