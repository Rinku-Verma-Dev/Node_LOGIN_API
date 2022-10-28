const dotenv = require('dotenv').config();
const router = require('./routers/router')
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
const cors = require('cors')

const app = express();
app.use(cors())

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/loginData');

// app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.use(express.static('public'));
app.use('/', router);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.listen(port, () => {
    console.log("listening post http://localhost:" + port + "/");
});

//npm run dev