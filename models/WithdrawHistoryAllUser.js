const mongoose = require("mongoose");

const WithdrawHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  userName: { type: String, required: true },
  profileImage: { type: String,  required: true},
  time: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  detectAmount: {type: Number, required: true},
  status: { type: String, default: "pending" }, // Default status is "pending"
});

module.exports = mongoose.model("WithdrawHistoryAllUser", WithdrawHistorySchema);
