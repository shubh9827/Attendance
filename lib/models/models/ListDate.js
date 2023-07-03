const mongoose= require('mongoose');
const ListDatesSchema= new mongoose.Schema({


   date: Date,
   month:Date,

  
}) 
module.exports=mongoose.model('ListDate',ListDatesSchema);