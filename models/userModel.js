const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const crypto=require('crypto');

const db_link='mongodb+srv://Riya:flyingbeast@cluster0.cgv0v.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
.then(function(db){
    console.log('user db connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },

    Email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.Email);
        }
    },

    Password:{
        type:String,
        required:true,
        minLength:8,
    },

    ConfirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){
            return this.ConfirmPassword=this.Password;
        }
    },

    profileImage:{
        type:String,
        default:'img/users/default.jpeg'
    },

    resetToken:String
});


userSchema.methods.createResetToken=function(){
    //creating unique token using npm crypto
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.resetToken=resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler=function(Password,ConfirmPassword){
    this.Password=Password;
    this.ConfirmPassword=ConfirmPassword;
    this.resetToken=undefined;
}

const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;