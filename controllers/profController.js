const express = require('express');
const jwk = require('jsonwebtoken');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
// importina leclass user : 
const Prof = require('./../models/user');
const isAdmin = require('../middlewares/middleware');
const bcrypt = require('bcryptjs');
const { findOne } = require('./../models/user');
const Course = require('../models/courses');


const app = express();


//POST
app.post('/add', isAdmin, (req, res) => {
    //1 - nekhou les données
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let user = new Prof({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        password: hashedPassword,
        role: "INSTRUCTOR",
        solde: 100,
    });
    console.log(user);
    user.save()
        .then(() => {
            res.status(200).send({ message: "prof added succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR prof register !" });
        });
});

app.post('/login', (req, res) => {
    let email = req.body._email;
    let password = req.body._password;
    console.log(email, password);
    Prof.findOne({ email: email }).then((admin) => {
        if (!admin) {
            res.status(404).send({ message: "email incorrect" });

        } else {
            let compare = bcrypt.compareSync(password, admin.password);
            console.log(compare);
            if (!compare) {
                res.status(404).send({ message: "password incorrect" });
            } else {

                //JSON WEB TOKEN - jsonwebtoken 
                let obj = {
                    id: admin._id,
                    role: admin.role,
                    firstname: admin.firstname + " " + admin.lastname,

                }
                console.log(obj);

                let myToken = jwk.sign(obj, "MyPrivateKey");

                res.status(200).send({ token: myToken });


            }

        }
    }).catch(() => {
        res.status(400).send({ message: "ERROR admin login !" });
    });
})


app.get('/all', isAdmin, async (req, res) => {

    try {
        let profs = await Prof.find({ role: "INSTRUCTOR" });
        res.status(200).send(profs);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});



app.get('/one/:idProf', (req, res) => {
    let id = req.params.idProf; // params w idProf ???????

    Prof.findOne({ role: "INSTRUCTOR", _id: id }).then((prof) => {
        if (!prof) {
            res.status(404).send({ message: "prof not found" });
        } else {
            res.status(200).send(prof);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})



app.get('/profile/:idUser', async (req, res) => {
    // params w idUser ???????

    try {
        let id = req.params.idUser;
        let user = await User.findOne({ _id: id })
        if (!user) {
            res.status(404).send({ message: "prof not found" });
        } else {
            res.status(200).send(user);
        }
    } catch (e) {
        res.status(400).send(e);
    }

})


//DELETE
app.delete('/delete/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;

    Prof.findOneAndDelete({ role: "INSTRUCTOR", _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "prof not found" });
        } else {
            res.status(200).send(user);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
//PATCH 
app.patch('/update-state/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;

    User.findOne({ role: "user", _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            user.etat = !user.etat;
            user.save();
            res.status(200).send({ message: "User Account state updated !! " });
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})

app.patch('/update-form/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;
    let data = req.body;

    // creation dun objet :
    let profUpdate = new Prof({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,


    });
    Prof.findOne({ _id: id })
        .then((prof) => {
            if (!prof) {
                res.status(400).send({ message: "prof not found" })
            } else {
                prof.firstname = profUpdate.firstname;
                prof.lastname = profUpdate.lastname;
                prof.phone = profUpdate.phone;
                prof.email = profUpdate.email;
                prof.save();
                res.status(200).send({ message: "prof updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})


app.get('/prof-courses-added/:profId', async (req, res) => {

    try {
        let id = req.params.profId;
        let TuniqueProfCourses = await Course.find({ etat: true, profId: id });
        let FuniqueProfCourses = await Course.find({ etat: false, profId: id });
        let AlluniqueProfCourses = await Course.find({ profId: id });
        res.status(200).send({ TuniqueProfCourses, FuniqueProfCourses, AlluniqueProfCourses });
    } catch (error) {
        res.status(400).send(error);
    }



})



module.exports = app;