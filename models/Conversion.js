const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  coinsDeductedPerMinute: { 
    type: Number, 
    required: true 
  }, // Coins deducted per minute for users

  diamondsReceivedPerMinute: { 
    type: Number, 
    required: true 
  }, // Diamonds received by hosts per minute

  diamondConversionFactor: {
    diamond: { 
      type: Number, 
      required: true 
    }, // Diamonds to Rupees
    rupee: { 
      type: Number, 
      required: true 
    } // Equivalent rupees
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversion', ConversionSchema);
