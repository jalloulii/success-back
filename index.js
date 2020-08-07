const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const User = require('./models/user');
const multipart = require('connect-multiparty');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const profController = require('./controllers/profController');
const courseController = require('./controllers/coursesController');
const multipartMiddleware = multipart({
    uploadDir: './public'
});
const app = express();



app.use(bodyParser.json());
// dossier public ywali accesible
app.use(express.static('public'));
// accept Files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/euser', userController);
app.use('/eadmin', adminController);
app.use('/eprof', profController);
app.use('/ecourse', courseController);
let port = process.env.PORT || 3000;

app.patch('/update-formPROFILE/:idUser', multipartMiddleware, (req, res) => {


    let data = JSON.parse(req.body.data);
    let id = req.params.idUser;
    if (req.files) {
        let path = req.files.image.path;
        const ext = path.substr(path.indexOf('.'));
        const newName = id;
        fs.renameSync(path, "public/" + newName + ext);

        // creation dun objet :
        let userUpdate = new User({
            firstname: data._firstname,
            lastname: data._lastname,
            email: data._email,
            image: newName + ext

        });
        User.findOne({ _id: id })
            .then((user) => {
                if (!user) {
                    res.status(400).send({ message: "user not found" })
                } else {
                    user.firstname = userUpdate.firstname;
                    user.lastname = userUpdate.lastname;
                    user.email = userUpdate.email;
                    user.image = userUpdate.image;
                    user.save();
                    console.log(user);
                    res.status(200).send({ message: "user updated successfully" });
                }
            })
            .catch((e) => {
                res.status(400).send(e);
            })
    } else {
        res.status(400).send({ message: "ERROR" });
    }



})





app.listen(port, () => console.log("server started !!")) 