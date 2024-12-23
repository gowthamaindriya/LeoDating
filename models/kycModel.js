/*const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    panDetails: {
        panNumber: { type: String, required: true },
        nameOnPan: { type: String, required: true },
        dob: { type: String, required: true },
        panImage: { type: String, required: true }, // Path to the uploaded PAN image
    },
    aadhaarDetails: {
        aadhaarNumber: { type: String, required: true },
        frontImage: { type: String, required: true }, // Path to Aadhaar front image
        backImage: { type: String, required: true },  // Path to Aadhaar back image
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminRemarks: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('KYC', kycSchema);
*/

const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    panDetails: {
        panNumber: { type: String, required: true },
        nameOnPan: { type: String, required: true },
        dob: { type: String, required: true },
        panImage: { type: String, required: true }, // Path to the uploaded PAN image
    },
    aadhaarDetails: {
        aadhaarNumber: { type: String, required: true },
        frontImage: { type: String, required: true }, // Path to Aadhaar front image
        backImage: { type: String, required: true },  // Path to Aadhaar back image
    },
    bankaccount: {
        accountHolderName: { type: String, required: true },   // Account holder's name
        bankName: { type: String, required: true },             // Bank name
        accountNumber: { type: String, required: true },        // Account number
        reenterAccountNumber: { type: String, required: true },// Re-entered account number for confirmation
        ifcCode: { type: String, required: true },             // IFSC code for the bank
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminRemarks: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('KYC', kycSchema);

