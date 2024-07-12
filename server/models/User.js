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
    default: "User", // Default value if name is not provided
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

module.exports = mongoose.model("User", userSchema);
