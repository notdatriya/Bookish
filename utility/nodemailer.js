const nodemailer=require('nodemailer');
module.exports.sendMail=async function sendMail(str,data){  //str-signup data-user
    let transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,//true for 465
        auth: {
            user: 'harryy.6066@gmail.com', 
            pass: "bvijipbghwtmxehd", 
          },
    });

    var Osubject,Ohtml;
    if(str=="signup"){
        Osubject=`Thankyou for signing ${data.Name}`;
        Ohtml=`
        <h1>Welcome to bookStore.com</h1>
        Hope you have a good time!
        Here are your details-
        Name-${data.Name}
        Email-${data.Email}`
    }
    else if(str=="resetpassword"){
        Osubject=`Reset Password`;
        Ohtml=`<h1>bookStore.com</h1>
        Here is your link to reset your password!
        ${data.resetPasswordLink}`
    }

    let info = await transporter.sendMail({
        from: '"BookStore" <harryy.6066@gmail.com>', 
        to: data.Email, 
        subject: Osubject, 
        html: Ohtml, 
      });
    
      console.log("Message sent: %s", info.messageId);
}