const express = require('express');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
const bcrypt = require('bcryptjs');
const math = require('mathjs')
// importina leclass user : 
const Admin = require('./../models/user');
const User = require('./../models/user');
const Course = require('../models/courses');
////////////////////////////////////////////////////////////
sum = (a, b) => {
    return a + b;
}
sub = (a, b) => {
    return a - b;
}

////////////////////////////////////////////////////////////

const app = express();

app.post('/register', (req, res) => {

    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    let user = new Admin({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        password: hashedPassword,
        role: "admin",
        solde: 0,

    });
    user.save()
        .then(() => {
            res.status(200).send({ message: "admin registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR admin register !" });
        });
});

app.get('/one', (req, res) => {

    Admin.findOne({ _id: '5f25515135aa1a0db0b09e10' }).then(admin => {
        res.status(200).send(admin)
    })
})
app.patch('/payment/:userId/:IdCourse', async (req, res) => {

    try {
        let userId = req.params.userId;
        let courseId = req.params.IdCourse;
        let user_to_checkout = await User.findOne({ role: "user", _id: userId });
        let course_to_pay = await Course.findOne({ _id: courseId });
        let admin_recieve_money = await Admin.findOne({ role: "admin", _id: '5f25515135aa1a0db0b09e10' });

        let course_price = course_to_pay.price;
        let user_solde = user_to_checkout.solde - course_price;
        let admin_solde = admin_recieve_money.solde + course_price;


        res.status(200).send({ user_solde, admin_solde, course_price });
        console.log(user_to_checkout)


    } catch (error) {
        res.status(400).send(error)
    }

})
/*
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
*/
module.exports = app;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWRhZTI1MDFlYjlkMzYyNGIwNGUwNCIsInJvbGUiOiJhZG1pbiIsImZpcnN0bmFtZSI6Inlhc3NpbmUgamFsbG91bGkiLCJpYXQiOjE1OTU3ODA4NDR9.UN8NZ9MiC9G4obYC0zivXnnnGnUEX2Pk29jz7gEevD0