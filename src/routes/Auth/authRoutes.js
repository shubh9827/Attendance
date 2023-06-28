const express= require('express')
const router= express.Router();

const authController=require('./authController');



router.get('/', authController.loginPage );
router.post('/login', authController.login );
router.get('/logout', authController.logOut);

module.exports=router;      