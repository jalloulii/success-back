const mongoose = require('mongoose');
const Course = require('./courses');
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
        },
        image: {
            type: String,
            default: ''
        }

    }
);
const User = mongoose.model("e-coaching-users", userSchema);
module.exports = User;