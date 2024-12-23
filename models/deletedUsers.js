const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Allows for unique but nullable fields
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Allows for unique but nullable fields
    },
    reason: {
        type: String,
        default: 'Account deleted',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);

module.exports = DeletedUser;
