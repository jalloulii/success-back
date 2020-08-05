const jwt = require('jsonwebtoken');
let isAdmin = function (req, res, next) {
    try {
        let token = req.header('Authorization');
        let decodedToken = jwt.verify(token, "MyPrivateKey");

        if (decodedToken.role == "admin") {
            
            next();
        } else {
            res.status(401).send({ message: "Unauthorized" })
        }
    } catch{
        res.status(403).send({ message: "FORBIDDEN" })
    }
}
module.exports = isAdmin;