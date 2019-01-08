const express = require('express');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Initing App
const app = express();

// Required app routes
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

// Db config
const db = require('./config/keys').dbURI;

// db connect to mongoose 
mongoose
    .connect(db)
    .then(() => console.log('DB is connected'))
    .catch((err) => console.log(err));

// Passport Midleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// App use body-parser midleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// App use routes
app.use('/api/users',users);
app.use('/api/posts',posts);
app.use('/api/profile',profile);

app.listen(port, (req, res) => console.log(`Server runing on ${port} port`));