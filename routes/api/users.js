const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Users modele 
const Users = require('../../models/Users');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route  POST api/users/register
// @desc   Registration users route
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }


    const avatar = gravatar.url(req.body.email , {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    Users.findOne({email : req.body.email})
        .then(user =>{
            if(user) {
                return res.status(400).json({email : 'Email is already exist'});
            } else{
                const newUser = new Users({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                    avatar,
                });
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                });
            }
        } )
});

// @route  POST api/users/login
// @desc   Login users route / JWT token
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({email})
         .then(user => {
             if(!user) {
                 return res.status(404).json({email : 'User not found'})
             }

             bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {id : user.id, name : user.name, avatar : user.avatar};
                        jwt.sign(payload, keys.secretOrKey , {expiresIn : 3600} , (err, token ) => {
                            res.json({
                                success : true,
                                token : 'Bearer ' + token
                            })
                        })
                    } else {
                        return res.status(400).json({password : 'Password is incorect'});
                    }
                })
         })
});
// @route  GET api/users/current
// @desc   return current user
// @access Public
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
    }
  );

module.exports = router;