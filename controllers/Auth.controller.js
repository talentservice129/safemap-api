const db = require('../config/db.config.js');
const config = require('../config/config.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const User = db.user;

var AuthController = {
    signUp: (req, res) => {
        // Save User to Database
        console.log("Processing func -> SignUp");
        
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role: 'USER'
        }).then(() => {
            return res.status(200).send('Success');
        })
    },

    signIn: (req, res) => {
        console.log("Sign-In");
        console.log(req.body);
        User.findOne({
            where: {
                email: req.body.email
            },
            attributes: ['id', 'username', 'email', 'password'],
            // include: [{
            //     model: Role,
            //     attributes: ['id', 'name'],
            //     through: {
            //         attributes: ['userId', 'roleId'],
            //     }
            // }]
        }).then(user => {
            if (!user) {
                return res.status(404).send('User Not Found.');
            }
    
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
            }
            
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
    
            res.status(200).send({ auth: true, user: user, accessToken: token });
        }).catch(err => {
            res.status(500).send('Error -> ' + err);
        });
    },

    forgot_pw: (req, res) => {
        var mailOptions = {
            from: 'noreply@premiumrealestate.in',
            to: req.body.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!',
        };

        User.findOne({
            where: {
                email: req.body.email
            },
            attributes: ['id', 'email'],
        }).then((result) => {
            mailOptions.html = `<a href='http://localhost:3000/auth/reset-pw?id=${result.id}'>Reset Password</a>`;

            var transporter = nodemailer.createTransport({
                host: 'mail.premiumrealestate.in',
                port: 465,
                secure: true,
                auth: {
                  user: 'noreply@premiumrealestate.in',
                  pass: 'wpdlfwjswk2'
                }
            });
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }).catch((err) => {
            console.log(err);
        })
    },

    reset_pw: (req, res) => {
        console.log(req.body.password);
        User.update(
            {
                password: bcrypt.hashSync(req.body.password, 8)
            },
            {
                where: { id: req.params.id}
            }
        )
    }
}

module.exports = AuthController;