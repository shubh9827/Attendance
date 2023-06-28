const { models:{  User } }= require('../../../lib/models');
const Joi= require('joi');
const {schema}= require('./userValidations');
const saltRounds=10;
const bcrypt= require('bcrypt');

class Users{
//----------------------------------------------------USER PAGE------------------------------------------------------
async userPage(req, res){
  if (!req.session._id && !req.session.Email) {
    res.redirect("/Auth");
  }
    res.render('users/userPage',{
        name:req.body.name,
        phoneno:req.body.phoneno,
        email:req.body.email,
        designation:req.body.designation,
        
    });
}
//----------------------------------------------------USER REGISTER-----------------------------------------------


async userRegister(req, res, next){
 try{
const result = await schema.validateAsync(req.body)

const founduser= await User.findOne({email:req.body.email}) 
if(founduser){
    req.flash("error","USER! ALREADY EXIST");
    res.locals.error=req.flash("error")
    res.render('users/userPage',{
        name:req.body.name,
        phoneno:req.body.phoneno,
        email:req.body.email,
        designation:req.body.designation,
        
    });

}else if(result.password.localeCompare(result.confirmPassword)!=0){
 
    req.flash("error","PASSWORD AND CONFIRM PASSWORD DOES NOT MATCH!!");
    res.locals.error=req.flash("error")
    res.render('users/userPage',{
        name:req.body.name,
        phoneno:req.body.phoneno,
        email:req.body.email,
        designation:req.body.designation,
        
    });

}else{
    
    let salt= await bcrypt.genSalt(saltRounds);
    let hashPassword= await bcrypt.hash(result.password,salt)
    result.password= hashPassword;
    let saveModel = new User(result);
    saveModel.save();
    req.flash("success","USER! ADDED SUCCESSFULLY");
    res.redirect('/Users/userPage');
}
//     res.redirect('/Users/userPage')
}





 
catch(err){
if(err.isJoi===true){
    req.flash("error",`${err}`)
    res.locals.error= req.flash("error");
    res.render('users/userPage',{
        name:req.body.name,
        phoneno:req.body.phoneno,
        email:req.body.email,
        designation:req.body.designation,
        
    });

}
next(err);
}
}
//----------------------------------------------------------END REGISTER----------------------------------------------------------------
//----------------------------------------------------------USERS- LISTPAGE-------------------------------------------------
async userListPage(req, res){
  if (!req.session._id && !req.session.Email) {
    res.redirect("/Auth");
  }
    res.render('users/userList',{title:"USERS LIST"});
  }
  //--------------------------------------------------------USERS-LIST------------------------------------------------------
  async userList(req,res){
    let reqData = req.query;
    let columnNo = parseInt(reqData.order[0].column);
    let sortOrder = reqData.order[0].dir === "desc" ? -1 : 1;
    let query = {
      // name:{$ne:null},
      email: { $ne: null },
      
      // isDeleted:false
    };
  
    if (reqData.search.value) {
      const searchValue = new RegExp(
        reqData.search.value
          .split(" ")
          .filter((val) => val)
          .map((value) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"))
          .join("|"),
        "i"
      );
  
      query.$or = [{ name: searchValue }, { email: searchValue }];
    }
    let sortCond = { created: sortOrder };
    let response = {};
    switch (columnNo) {
      case 1:
        sortCond = {
          name: sortOrder,
        };
        break;
      case 5:
        sortCond = {
          status: sortOrder,
        };
        break;
      default:
        sortCond = { created: sortOrder };
        break;
    }
  
    const count = await User.countDocuments(query);
    response.draw = 0;
    if (reqData.draw) {
      response.draw = parseInt(reqData.draw) + 1;
    }
    response.recordsTotal = count;
    response.recordsFiltered = count;
    let skip = parseInt(reqData.start);
    let limit = parseInt(reqData.length);
    let Users = await User.find(query)
      .sort(sortCond)
      .skip(skip)
      .limit(limit)
      .lean();
    console.log(Users);
  
    if (Users) {
      Users = Users.map((user) => {
        let actions = "";
  
        actions = `${actions}<a href="/patient/edit/${user._id}" title="edit"> | <i class="fas fa-edit"></i> | </a>`;
  
        actions = `${actions}<a class="ItemDelete" confirm_message="Are you sure you want to delete ${user.Name} account" href="/patient/delete/${user._id}" title="Delete"> <i class="fas fa-trash"></i> | </a>`;
  
        actions = `${actions}<a href="/patient/view/${user._id}" title="view"><i class="icofont-user"></i></a>`;
        // user.date= new Date(user.date).toLocaleDateString() 
        return {
          0: (skip += 1),
          1: user.name,
          2: user.email,
          3: user.phoneno,
          // 4: user.date,
          // 5: user.docName,
          // 6: user.time,
          // 7: user.Status,
        };
      });
    }
    response.data = Users;
    return res.send(response);
  }


}

//--------------------------------------------END CLASS---------------------------------------------------------


module.exports=new Users();