const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load Users modele 
const Users = require('../../models/Users');

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req,res) => {
    res.json({ msg: 'users/test route is working!!!'});
});

// @route  POST api/users/register
// @desc   Registration users route
// @access Public
router.post('/register', (req, res) => {
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

module.exports = router;