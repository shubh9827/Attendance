const express = require('express');
const router = express.Router();
const fs = require('fs');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// global._ = require('lodash');


const AuthController = require('./Auth/authController');



const routes = fs.readdirSync(__dirname);

routes.forEach(route => {
    if (route === 'index.js') return;
    console.log(route);
    router.use(`/${route}`, require(`./${route}`));
});
// router.get('/register',AuthController.registrationPage);
// router.post('/docorpat',AuthController.DocOrPat)

module.exports=router;