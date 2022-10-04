const {sendMail}=require('../utility/nodemailer');
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const flash = require('connect-flash');
const {JWT_KEY}=require('../secrets');



module.exports.getSignUp=async function getSignUp(req,res){
    res.sendFile('D:/riya/Web development/bookWebsite/view/signUpPage.html');
};



module.exports.signup=async function signup(req,res){
    try{
    let dataObj=req.body;
    let user=await userModel.create(dataObj);
    
    sendMail("signup",user);
    if(user){
        console.log("user signed up");
         res.json({
            message:"user signed up",
            data:user
            
        })
         
    }
    else{
        res.json({
            message:"error while signing up"
        }); 
    }

    
}
catch(err){
    res.json({
        message:err.message
    })
}
};



module.exports.getLogin=async function getLogin(req,res){
    res.sendFile('./index.html');
};


module.exports.login=async function login(req,res){
    try{
    let data=req.body;
    if(data.Email){
    let user=await userModel.findOne({Email:data.Email});

    if(user){
        //bcrypt->compare
        if(user.Password==data.Password){

            // res.cookie('isLoggedIn',true,{httpOnly:true});
            let uid=user['_id'];  //unique id
            let token=jwt.sign({payload:uid},JWT_KEY);
            res.cookie('login',token,{httpOnly:true});
            console.log("user logged in");
            return res.json({
                message:'user has logged in',
                userDetails:data,
            });

        }
        else{
            return res.json({
                message:'wrong credentials',
            })
        }
    }
    else{
    //     const client=req.get('User-Agent');
    //     if(client.includes("Mozilla")==true){
    //        return res.redirect('/user/login');
    //   }
        //return res.redirect('/user/signup');
        return res.json({
            message:"user not found",
        })
    }
}
else{
    return res.json({
        message:"enter email"
    })
}
}
catch(err){
return res.status(500).json({
    message:err.message
})
}
};


//protect route

module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        let token;
        if(req.cookies.login){
            token=req.cookies.login;
            console.log('hello');
            // let isVerified=jwt.verify(req.cookies.login,JWT_KEY);
            let payload=jwt.verify(token,JWT_KEY);
            // if(isVerified){
            //     next();
            // }
            if(payload){
            const user=await userModel.findById(payload.payload);
            req.role=user.role;
            req.id=user.id;
            next();
            }
            else{
                 return res.json({
                    message:'user not verified'
                })
            }
        
        }
        // if(req.cookies.isLoggedIn){
        //    next();
        // }
        else{
             
            //browser
             const client=req.get('User-Agent');
             if(client.includes("Mozilla")==true){
                return res.redirect('/user/login');
           }
        //postman
            res.json({
               message:'please login again'
             });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        })
       
    }
        }


module.exports.getForgetPassword=async function getForgetPassword(req,res){
res.sendFile("D:/riya/Web development/bookWebsite/view/forgetPassword.html");
}


module.exports.forgetpassword=async function forgetpassword(req,res){
    let{Email}=req.body;
    try{
        const user=await userModel.findOne({Email:Email});
        if(user){

        //used to create new token
        const resetToken=user.createResetToken();
        user.resetToken=resetToken;
        await user.save();
        console.log(resetToken);
        //http://abc.com/resetpassword/resetToken
        let resetPasswordLink=`${req.protocol}://${req.get('host')}/user/resetpassword/${resetToken}`;

        //send email to user
        //nodemailer
        let obj={
            resetPasswordLink:resetPasswordLink,
            Email:Email
        }
        sendMail("resetpassword",obj);
        return res.json({
            message:"email sent"
        })
        }
        else{
            return res.json({
                message:"please sign up"
            });
        }
    }
        catch(err){
            res.status(500).json({
                message:err.message
            })
        }
    };

    module.exports.getResetPassword=async function getResetPassword(req,res){
        // let url=new URL('http://localhost:3000/user/resetpassword/:token');
        // let params=new URLSearchParams(url.search);
        // console.log(params.get('token'));
        // _http.get('/user/resetpassword/',{params:{
        //     token}
        // }).then(({data})=>{
        //     console.log(okkkk);
        //     res.sendFile("D:/riya/Web development/bookWebsite/view/resetPassword.html");
        // })
        // .catch((err)=>{
        //     console.log("errrrrr");
        // })
        res.sendFile("D:/riya/Web development/bookWebsite/view/resetPassword.html");
        
       
        
    };


    module.exports.resetpassword= async function resetpassword(req,res){
        try{
            console.log("Entered");
        let token=req.params.token;
        
        console.log(req.params.token);
        let {Password,ConfirmPassword}=req.body;
        const user=await userModel.findOne({resetToken:token});
        if(user){
        //it will update update password in db
        user.resetPasswordHandler(Password,ConfirmPassword);
        await user.save();
        console.log("reset done");
        res.json({
            message:"password changed successfully,please login again"
        })
    }
    else{
        res.json({
            message:"user not found"
        })
    }
    }
    catch(err){
        console.log("err");
        res.json({
            message:err.message
        });
    }
    };


    module.exports.logout= function logout(req,res){
        res.cookie('login','',{maxAge:1}); //1 in ms
        res.json({
            message:"user logged out successfully"
        });
    }

    module.exports.getProfileImage=function getProfileImage(req,res){
        res.sendFile("D:/riya/Web development/bookWebsite/view/multer.html");
    }
