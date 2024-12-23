const mongoose = require('mongoose');
const moment = require('moment-timezone');

const coinPurchaseTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  coinsPurchased: { type: Number, required: true },
//  transactionDate: { type: Date, default: Date.now },
transactionDate: { type: Date, default: () => moment.tz('Asia/Kolkata').toDate() },
  transactionId: { type: String, required: true, unique: true }, // Unique ID for the transaction
  status: { type: String, required: true } // e.g., 'completed', 'pending'
});

// Pre-save middleware to ensure transactionDate is always in IST
coinPurchaseTransactionSchema.pre('save', function (next) {
  if (!this.transactionDate) {
    this.transactionDate = moment.tz('Asia/Kolkata').toDate();
  }
  next();
});

module.exports = mongoose.model('CoinPurchaseTransaction', coinPurchaseTransactionSchema);
