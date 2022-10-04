const cookieParser = require('cookie-parser');
const express=require('express');
const cors = require('cors');

let app=express();
app.use(express.json());
app.use(cookieParser());
app.listen(process.env.PORT ||3000);

const userRouter=require('./Routers/userRouter');

// app.use(cors({
//     origin: ['https://chrome.google.com','https://mail.google.com','https://google.com']
// }));


app.use('/user',userRouter);
