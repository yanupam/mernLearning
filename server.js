const express =require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const jwtPassword = 'jwt-password';
const {MONGODB_CONNECTION_STRING,USERS_TABLES} = require('../mernLearning/constants/constants');
const {UserModal} = require('./modals/User');
const app = express();
app.use(express.json());

mongoose.connect(`${MONGODB_CONNECTION_STRING}my-app`);

const User = mongoose.model(USERS_TABLES,UserModal);

const schemaValidation = z.object({
    username: z.string(),
    password:z.string(),
    name:z.string(),
    age:z.number().int()
});



const schemaValidationMiddleWare = (req,res,next)=>{
    const response = schemaValidation.safeParse(req.body);
    if(!response.success){
       return res.status(402).json({
        message:'Invalid inputs'
       })
    }else{
        next();
    }
}
const doUserExist = async({username})=>{
    const user =await User.findOne({username:username});
    if(user){return true}
    else{return false};
};



app.get('/auth',(req,res)=>{
    const auth = req.headers.auth;
  try {
    const decodedToken = jwt.verify(auth,jwtPassword);
    console.log(decodedToken);
    const userName = decodedToken.username;
    return res.status(200).send(userName);
    
  } catch (error) {
    return res.status(403).json({
        error:'Invalid Token'
    })
  }
  
})

app.post('/signin',async(req,res)=>{
    const {username,password} = req.body;
    const user =await User.findOne({username:username,password:password});
    if(!user){
        res.status(403).json({
            'error':'Wrong credentials'
        });
    }else{
        let token = jwt.sign({username},jwtPassword);
        return res.json({
            token
        })
    }
  
});

app.post('/signup',schemaValidationMiddleWare,async(req,res)=>{
    const {username,password,name,age}= req.body;
    try {
        const isUserInDB = doUserExist({username});
        if(isUserInDB){
            throw new Error('user exists');
        }
        const userToSave = new User({
            username,
            password,
            name,
            age
        });
        await userToSave.save();
        res.status(201).json({
            message:'USER CREATED'
        })
    } catch (error) {
        res.json({
            status:409,
            message:error.message
        })
    }
})

app.use((err,res,req,next)=>{
    res.status(500).json({message:"INTERNAL SERVER ERROR"});
})

app.listen(3000);