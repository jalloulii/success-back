const express = require('express');
const jwk = require('jsonwebtoken');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
// importina leclass user : 
const User = require('./../models/user');
const Admin = require('./../models/user');
const isAdmin = require('../middlewares/middleware');
const bcrypt = require('bcryptjs');
const Course = require('../models/courses');
const Prof = require('../models/prof');
////////////////////////////////////////////////////////////
sum = (a, b) => {
    return a + b;
}
sub = (a, b) => {
    return a - b;
}
//   function sum2(a, b) {
//       return a + b;
//   }
////////////////////////////////////////////////////////////

const app = express();


//POST
app.post('/register', (req, res) => {
    //1 - nekhou les données
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let user = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        password: hashedPassword,
        role: "user",
        solde: 100,
    });
    console.log(user);
    user.save()
        .then(() => {
            res.status(200).send({ message: "User registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR User register !" });
        });
});

app.post('/login', (req, res) => {
    let email = req.body._email;
    let password = req.body._password;
    console.log(email, password);
    User.findOne({ email: email }).then((admin) => {
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
                    welcomename: admin.firstname,
                    email: admin.email,
                    solde: admin.solde,
                }

                let myToken = jwk.sign(obj, "MyPrivateKey");
                console.log(myToken);
                res.status(200).send({ token: myToken });


            }

        }
    }).catch(() => {
        res.status(400).send({ message: "ERROR admin login successfully" });
    });
})


app.get('/all', isAdmin, async (req, res) => {

    try {
        let users = await User.find({ role: "user" });
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});



app.get('/one/:idUser', (req, res) => {
    let id = req.params.idUser; // params w idUser ???????

    User.findOne({ _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "user not found" });
        } else {
            res.status(200).send(user);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})



//DELETE
app.delete('/delete/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;

    User.findOneAndDelete({ role: "user", _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(200).send({ message: "User Deleted successfully" });
            res.status(200).send(user);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})


app.patch('/update-form/:idUser', (req, res) => {
    let id = req.params.idUser;
    let data = req.body;

    // creation dun objet :
    let userUpdate = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        phone: data._phone,
        email: data._email,


    });
    User.findOne({ _id: id })
        .then((user) => {
            if (!user) {
                res.status(400).send({ message: "user not found" })
            } else {
                user.firstname = userUpdate.firstname;
                user.lastname = userUpdate.lastname;
                user.phone = userUpdate.phone;
                user.email = userUpdate.email;
                user.save();
                res.status(200).send({ message: "user updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})
/*
app.post('/add-solde/:idUser', async (res, req) => {
    try {
        let id = req.params.idUser;
        let data = req.body;
        let user = await User.findOne({ _id: id }),
        if(!user){
            res.status(404).send({message :"user not found"})
        }else{
            user.solde = sum(user.solde, data._add_solde);
           
        }
         res.status(200).send({ message: "user solde added susccesfully !! " });
            user.save();
    } catch (error) {

    }
})
*/
app.post('/add-solde/:idUser', (req, res) => {
    let id = req.params.idUser;
    let data = req.body;
    User.findOne({ _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "user not found" });
        } else {

            user.solde = sum(user.solde, data._add_solde);
            user.save();
            res.status(200).send({ message: "user solde added susccesfully !! " });


        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})

app.patch('/payment/:idUser/:idCourse', (req, res) => {
    let idUser = req.params.idUser;
    let idCourse = req.params.idCourse;

    User.findOne({ _id: idUser }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "user not found" });
        } else {

            Course.findOne({ _id: idCourse }).then((course) => {
                if (!course) {
                    res.status(404).send({ message: "user not found" });
                } else {

                    if (user.solde < course.price) {
                        res.status(404).send({ message: "solde ne9es" });
                    } else {
                        Admin.findOne({ _id: '5f25515135aa1a0db0b09e10' }).then((admin) => {
                            admin.solde = sum(admin.solde, course.price);
                            admin.save();
                        })
                        user.solde = sub(user.solde, course.price);

                    }

                }
                user.save();
                res.status(200).send({ message: "done" });
            })

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
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(200).send(user);
        }
    } catch (e) {
        res.status(400).send(e);
    }

})

app.get('/all-profs-admins', async (req, res) => {
    try {
        let get_profs = await User.find({ role: "INSTRUCTOR" });
        let get_admin = await User.find({ role: "admin" });

        res.status(200).send({ profs: get_profs, admin: get_admin });
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = app;