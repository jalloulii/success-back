const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        lesson_body: {
            type: String,
            required: true,
        },
        quiz_question: {
            type: String
        },
        quiz_choix_1: {
            type: String
        },
        quiz_choix_2: {
            type: String
        },
        quiz_choix_3: {
            type: String
        },
        quiz_user_reply: {
            type: String
        },
        quiz_real_reply: {
            type: String
        },
        etat: {
            type: Boolean,
        },
        profId: {
            type: String,
        },
        categorie: {
            type: String,
        }

    }
);
const Course = mongoose.model("e-coaching-courses", courseSchema);
module.exports = Course;