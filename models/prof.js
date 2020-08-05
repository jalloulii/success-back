const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true

        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String, 

        },
        solde: {
            type: Number,
        }
    }
);
const Prof = mongoose.model("e-coaching-profs", userSchema);
module.exports = Prof;