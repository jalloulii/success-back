const express = require('express');
const jwk = require('jsonwebtoken');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
// importina leclass user : 
const User = require('./../models/user');
const Prof = require('./../models/prof');
const Course = require('./../models/courses');
const isAdmin = require('../middlewares/middleware');
const { i } = require('mathjs');
const app = express();


app.get('/all', async (req, res) => {

    try {
        let courses = await Course.find({});
        res.status(200).send(courses);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});
app.get('/all-true', async (req, res) => {

    try {
        let courses_true = await Course.find({ etat: true });
        res.status(200).send(courses_true);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});
app.get('/all-false', async (req, res) => {

    try {
        let courses_false = await Course.find({ etat: false });

        res.status(200).send(courses_false);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});

app.post('/add', (req, res) => {

    let data = req.body;
    let id = req.params.idProf;


    console.log(res);
    let course = new Course({
        title: data._title,
        description: data._description,
        price: data._price,
        lesson_body: data._lesson_body,
        quiz_question: data._quiz_question,
        quiz_choix_1: data._quiz_choix_1,
        quiz_choix_2: data._quiz_choix_2,
        quiz_choix_3: data._quiz_choix_3,
        quiz_user_reply: data._quiz_user_reply,
        quiz_real_reply: data._quiz_real_reply,
        etat: "false",
        profId: data._profId,
        categorie: data._categorie,



    });

    course.save()
        .then(() => {
            res.status(200).send(course);
        })
        .catch(() => {
            res.status(400).send({ message: "course unsuccessfully added :) !" });
        });
})

app.get('/one/:idCourse', (req, res) => {
    let id = req.params.idCourse; // params w idCourse ???????

    Course.findOne({ _id: id }).then((course) => {
        if (!course) {
            res.status(404).send({ message: "course not found" });
        } else {
            res.status(200).send(course);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})

app.patch('/update-state/:idCourse', isAdmin, (req, res) => {
    let id = req.params.idCourse;

    Course.findOne({ _id: id }).then((course) => {
        if (!course) {
            res.status(404).send({ message: "course not found" });
        } else {
            course.etat = !course.etat;
            course.save();
            res.status(200).send({ message: "course Account state updated !! " });
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.get('/all-true-categories', async (req, res) => {

    try {
        let courses_true_dev = await Course.find({ etat: true, categorie: "DEVELOPMENT" });
        let courses_true_des = await Course.find({ etat: true, categorie: "DESIGN" });
        let courses_true_PG = await Course.find({ etat: true, categorie: "PHOTOGRAPHY" });
        let courses_true_teaching = await Course.find({ etat: true, categorie: "TEACHING" });
        let courses_true_gaming = await Course.find({ etat: true, categorie: "GAMING" });
        res.status(200).send({ courses_true_dev, courses_true_des, courses_true_PG, courses_true_teaching, courses_true_gaming });
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});
module.exports = app;