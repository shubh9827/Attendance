const mongoose= require('mongoose');
const AttendanceSchema= new mongoose.Schema({

   name: String,
   punchin:Date,
   email: String,
   date: Date,
   inTime: String,
   outTime: String,
   duration:String,
   isDeleted:{
      type:Boolean,
      default:false
   }

}) 
module.exports=mongoose.model('Attendance',AttendanceSchema);
