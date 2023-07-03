const express= require('express')
const router= express.Router();
const attendanceController= require('./attendanceController');
const authController = require('../Auth/authController');




router.get('/accdelete/:_id', attendanceController.accdelete);
router.get('/makeAttendance', attendanceController.makeAttendance);
router.get('/delete',attendanceController.delete)
router.post('/registerAtten', attendanceController.registerAtten);
router.get('/listPage', attendanceController.listPage);
router.get('/list', attendanceController.list);
router.post('/date', attendanceController.date);
router.post('/delchecks', attendanceController.delchecks);


module.exports=router;