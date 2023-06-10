const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  whatsappNumber: { type: String, unique: true, default: "" },
  last: { type: Number, default: 0 },
  flow: { type: Number, default: 0 },
  cramps: { type: Number, default: 0 },
  mood: { type: Number, default: 0 },
  ovulation: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  bmi: { type: Number, default: 0 },
  race: { type: Number, default: 0 },
  medicalHistory: { type: Number, default: 0 },
  medications: { type: Number, default: 0 },
  lengthOfMenstrualCycle: { type: Number, default: 0 },
  lengthOfMenses: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
