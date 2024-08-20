const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "User",
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};


module.exports = mongoose.model("User", userSchema);
