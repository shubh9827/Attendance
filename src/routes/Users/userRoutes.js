const express= require('express');
const userController= require('./userController');
const router= express.Router();


 router.get('/userPage',userController.userPage);
 router.post('/userRegister',userController.userRegister);
 router.get('/userListPage', userController.userListPage);
router.get('/userList', userController.userList);
  module.exports=router;