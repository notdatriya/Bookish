const express=require('express');
const userRouter=express.Router();
const multer=require('multer');
const {getSignUp,signup,getLogin,login,getForgetPassword,forgetpassword,getResetPassword,resetpassword,protectRoute,logout,getProfileImage}=require('../controller/authController');
const {updateProfileImage,downloadFile,getDownloadFile}=require('../controller/userController');

userRouter.route('/signup')
.get(getSignUp)
.post(signup)

userRouter.route('/login')
.get(getLogin)
.post(login)

userRouter.route('/forgetpassword')
.get(getForgetPassword)
.post(forgetpassword)

userRouter.route('/resetpassword/:token')
.get(getResetPassword)
.post(resetpassword)

userRouter.route('/logout')
.get(logout)




const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'D:/riya/Web development/bookWebsite/public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter=function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an Image!please upload an image"),false)
    }
}
const upload=multer({
    storage:multerStorage,
    fileFilter:filter
});

userRouter.route('/ProfileImage')
.get(getProfileImage)

// userRouter.get('/ProfileImage',protectRoute,(req,res)=>{
//     res.sendFile("D:/riya/Web development/bookWebsite/view/multer.html")
// })
userRouter.post("/ProfileImage",upload.single("photo"),updateProfileImage);


userRouter.route('/fileDownload')
//.get(getDownloadFile)
.get(protectRoute,downloadFile);


module.exports=userRouter;