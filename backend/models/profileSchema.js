const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    }
});

const profile = mongoose.model('profile', profileSchema);

module.exports = profile;
