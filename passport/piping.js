let passport  = require('passport');
const Staff = require("../code/databases/staff/staff");
const Students = require("../code/databases/student_center/students");
const Faculties = require("../code/databases/student_center/faculties");

passport.serializeUser((user, done) => {
    //console.log(user);
    //console.log("serialize: "+user.role);
      done(null, {_id:user._id,role:user.role});
  });
  
  passport.deserializeUser(async (user_obj, done) => {
    //console.log(user_obj);
    console.log("deserialize: "+user_obj.role);
    try{
      let user;
      if(user_obj.role == "user"){
        user = await Students.findById(user_obj._id); 
      }
      else if(user_obj.role=="faculty"){
        user = await Faculties.findById(user_obj._id);
      }
      else{
        user= await Staff.findById(user_obj._id);
      }
  
      user = user.toObject();
      user.role=user_obj.role;
      done(null, user);
    }
    catch(err)
    {
      console.log("deserialization issue");
      console.log(err);
      done(null,false,err);
    }
  });