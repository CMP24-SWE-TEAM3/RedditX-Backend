const { promisify } = require("util"); // built in nofe module
//const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User=require('../models/user-model');
const catchAsync = require("../utils/catch-async");
const bcrypt = require('bcrypt');
const decodeJwt=require('./google-facebook-oAuth');
const randomUsername=require('../utils/random-username');
//const crypto = require("crypto");



//check whether user name is in database or not (function)
const availableUser=async(username)=>{


   const user=await User.findById(username );
   if(user) {
        return {
          "state":false,
          "user":user
        }
      }   
   else {
        return {
          "state":true,
          "user":null
        }
      }
};

const availabeGmailOrFacebook=async(email,type)=>{
    const user = await User.findOne({email:email,type:type});
    if(user) {
      return {
        "exist":true,
        "user":user
      }
    }   
  else {
      return {
        "exist":false,
        "user":null
      }
    }
}

//available-gmailorfacebook (route)
const availableGorF=async(req,res)=>{
  const data= await availabeGmailOrFacebook(req.body.email,req.body.type);
  if(data.exist==false){
  return res.status(200).json({
    response:"Avaliable" 
  });}
  else{
    return res.status(404).json({
      response:"Not Avaliable" 
    });
  }
}

//change password according to type of signup
const changePasswordAccType=(type,password)=>{
  return (type=='facebook'||type=='gmail')?'1':password; 

}
//signing token
const signToken =(emailType,username)=>{ 
  
  return jwt.sign({ emailType: emailType, username: username },
  "mozaisSoHotButNabilisTheHottest", { expiresIn: "1h" }
)};

//route (available-username)
const availableUsername = async(req,res)=>{
 const data= await availableUser(req.params.username);
  if(data.state==false){
  return res.status(200).json({
    response:"Avaliable" 
  });}
  else{
    return res.status(404).json({
      response:"Not Avaliable" 
    });
  } 
}

//save User in database
const createUser=async(email,hash,username,type)=>{

  const user=new User({
    email: email,
      password: hash,
     _id: username,
       type: type
      ,isPasswordSet:(type=='gmail'||type=='facebook')?false:true
  });
 const result= user.save()  .then((result) => {
    return {
        username:user._id,
        status:"done"
       }
})
.catch((err) => {
  return {
        username:null,
        status:"error",
        error:"duplicate key"
       }
});
return result;
 
  // let user=await User.create({ email: email,
  //     password: hash,
  //    _id: username,
  //      type: type
  //     ,isPasswordSet:(type=='gmail'||type=='facebook')?false:true
  //     },
  //       (err,result)=> {
  //       console.log("errr",err);
  //       console.log("res",result);
        
  //       if (err==null) {
  //          errors= false;
  //          user=result;
  //         }
  //       else  errors=true;
  //       // saved!
  //     }
  //     );

      // (err,result)=>{
      //   //   if(err!=null){
      //   //    console.log(err);
      //   //  console.log('errr');
      //   //   return null;
      //   // }
      //   // else return result;
      //   }
      // console.log("fetcheduser"+user);
      // if(user!=undefined){
      //  return {
      //   username:user._id,
      //   status:"done"
      //  }
      // }
      // else{
      //   return {
      //     username:null,
      //     status:"error",
      //     error:"duplicate key"
      //    }
      // }
  // const user = new User({
  //   email: email,
  //   password: hash,
  //   _id: username,
  //   type: type
  //   });
  // user
  //   .save()
  //   .then((result)=>{
  //     console.log(result);
  //     return {
  //       username:user._id,
  //       status:"done"
  //     }
  //   })
  //   .catch((err) => {
        
  //       return{ 
  //         username:null,
  //         error: err,
  //       }
  //   });

  // User.create({  email: email,
  //     password: hash,
  //      _id: username,
  //      type: type }, function (err) {
  //   if (err) return handleError(err);
  //   // saved!
  // });
    // then((result)=>{
    //   console.log(result);
    //   return {
    //     username:user._id,
    //     status:"done"
    //   }
    // })
}

//route (signup)
const signup=async(req,res)=>{
  
  const pass=changePasswordAccType(req.body.type,req.body.password);
  const hash= await bcrypt.hash(pass, 10);
  if(req.body.type=='gmail'|| req.body.type=='facebbok'){
    const email=decodeJwt.decodeJwt(req.body.googleOrFacebookToken).payload.email;
    const data=await availabeGmailOrFacebook(email,req.body.type);
    console.log(data);
    //case if not available in database random new username and send it 
    if(data.exist==false){
      console.log('gmail or facebook not exist');
        const username=randomUsername.randomUserName();
        console.log("random user name");
        console.log(username);
        const result=await createUser(email,hash,username,req.body.type);
        console.log("result "+result.username);
        if(result.username!=null){
          const token=signToken(req.body.type,username);
          return res.status(200).json({
            token: token,//token,
            expiresIn:3600,
            username:username
        });     
        }
        else{
          return res.status(404).json({
            error:result.error
          })
        }
    }
    else{
      console.log('gmail or facebook  existssss');

      const token=signToken(req.body.type,data.user_id);

      return res.status(200).json({
        token: token,//token,
        expiresIn:3600,
        username:data.user._id
    });  
    }
  }
  else{
    //signup with bare email
    console.log('signup with bare email');
    const result=await createUser(req.body.email,hash,req.body.username,req.body.type);
    console.log("returned result",result);
    if(result.username!=null){
      const token=await signToken(req.body.type,req.body.username);

      return res.status(200).json({
        token: token,//token,
        expiresIn:3600,
        username:req.body.username
    });     
    }
    else{
      return res.status(404).json({
        error:result.error
      })
    }


  } 
}

const login=async(req,res)=>{
  const pass=changePasswordAccType(req.body.type,req.body.password);
  const hash= await bcrypt.hash(pass, 10);
  if(req.body.type=='gmail'|| req.body.type=='facebbok'){
    const email=decodeJwt.decodeJwt(req.body.googleOrFacebookToken).payload.email;
    const data=await availabeGmailOrFacebook(email,req.body.type);
    console.log(data);
    //case if not available in database random new username and send it 
    if(data.exist==false){
      console.log('gmail or facebook not exist');
        const username=randomUsername.randomUserName();
        console.log("random user name");
        console.log(username);
        const result=await createUser(email,hash,username,req.body.type);
        console.log("result "+result.username);
        if(result.username!=null){
          const token=signToken(req.body.type,username);
          console.log(token);
          return res.status(200).json({
            token: token,//token,
            expiresIn:3600,
            username:username
        });     
        }
        else{
          return res.status(404).json({
            error:result.error
          })
        }
    }
    else{
      console.log('gmail or facebook  existssss');

      const token=signToken(req.body.type,data.user_id);

      return res.status(200).json({
        token: token,//token,
        expiresIn:3600,
        username:data.user._id
    });  
    }
  }
  else{
    let fetchedUser;
  
    User.findById({ _id: req.body.username })
    .then((user) => {
        if (!user) {
            return res.status(404).json({
               type:"bare email",
               error: "Wrong username or password."
            });
        }
        console.log(user);
        fetchedUser = user;
        console.log(req.body.password);
        console.log(user.password);
        return bcrypt.compareSync(req.body.password, user.password);
    })
    .then(async(result) => {
        if (!result) {
            return res.status(404).json({
              type:"bare email",
               error: "Wrong username or password."
            });
        }
        const token=await signToken(req.body.type,req.body.username);

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            username: result._id,
        });
    })
    .catch((err) => {
      console.log(err);
        return res.status(401).json({
          type: "bare email",
           error: "Wrong username or password."
        });
    });
  }

}
  


module.exports = {
  availableUser,
  availableUsername,
  signup,
  availableGorF,
  login
}

// const signup = async(req,res)=>{

//         ///const url = req.protocol + "://" + req.get("host");
//         const type=req.body.type;
//         const pass=(type=='facebook'||type=='gmail')?'1':req.body.password;
//         if(type=='gmail'||type=='facebook'){
//             //search in database if found send it to login

//         }
     
//         bcrypt.hash(pass, 10).then(function(hash) {
//             const user = new User({
//                 email: req.body.email,
//                 password: hash,
//                 username: req.body.username,
//             });
//             user
//                 .save()
//                 .then((result) => {
//                     //create token
//                     //create expiresIn
//                     res.status(201).json({
//                         token: 'temp',//token,
//                         expiresIn:3600
//                     });
//                 })
//                 .catch((err) => {
//                     res.status(500).json({
//                         error: err,
//                     });
//                 });
//         });
// }








// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// const createAndSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   /*const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//     sameSite: 'strict',
//   };
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
//   res.cookie('jwt', token, cookieOptions);*/
//   // Remove password from output
//   user.password = undefined;
//   res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signup = catchAsync(async (req, res, next) => {
//   //const newUser = await User.create(req.body);
//   //const url = `${req.protocol}://${req.get('host')}/me`;
//   //await new Email(newUser, url).sendWelcome();
//   //createAndSendToken(newUser, 201, res);
// });

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return next(new AppError("Please provide email and password!", 400));
//   //const user = await User.findOne({ email }).select('+password'); // {email: email} = {email}
//   //if (!user || !(await user.correctPassword(password, user.password)))
//   //  return next(new AppError('Incorrect email or password'));
//   //createAndSendToken(user, 200, res);
// });

// exports.logout = (req, res) => {
//   res.cookie("jwt", "loggedout", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });
//   res.status(200).json({ status: "success" });
// };

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   )
//     token = req.headers.authorization.split(" ")[1];
//   else if (req.cookies) token = req.cookies.jwt;
//   // Check if there is no token
//   if (!token)
//     return next(
//       new AppError("You are not logged in! Please log in to get access.", 401)
//     ); // 401 unauthorized
//   // payload here is user id
//   // verify the token
//   const decodedPayload = await promisify(jwt.verify)(
//     token,
//     process.env.JWT_SECRET
//   );
//   // check if the user is still exists
//   //const user = await User.findById(decodedPayload.id);
//   //if (!user)
//   //  return next(
//   //    new AppError(
//   //      'The user belonging to this token does no longer exist.',
//   //      401
//   //    )
//   //  );
//   // check if the user changed his password after this token
//   //if (user.changedPasswordAfter(decodedPayload.iat))
//   // iat: issued at
//   //  return next(
//   //    new AppError('User recently changed password! Please log in again.'),
//   //    401
//   //  );

//   // save the user for the next middleware
//   //req.user = user;
//   //res.locals.user = user;
//   next();
// });
