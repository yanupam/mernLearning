const express =require('express');
const z = require('zod');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const jwtPassword = 'jwt-password';
const {MONGODB_CONNECTION_STRING} = require('../mernLearning/constants/constants');
const {MODEL_USER} = require('./modals/User');
const app = express();
app.use(express.json());

mongoose.connect(`${MONGODB_CONNECTION_STRING}my-app`);

const User = mongoose.model('users_tables',{
    username: String,
    password:String,
    name:String,
    age:Number

});
let dataStore = [
    {   
        id:1,
        username:'anupam@yopmail.com',
        password:'test@123',
        name:'Anupam',
        age:24
    },
    {
        id:2,
        username:'anuradha@yopmail.com',
        password:'test@1234',
        name:'Anuradha',
        age:22
    }
];

const schemaValidation = z.object({
    username: z.string(),
    password:z.string(),
    name:z.string(),
    age:z.number().int()
});

const authMiddleWare = (req,res,next)=>{
   try {
    const username = req.headers.username;
    const response = schemaValidation.safeParse(req.body);
    console.log('AUTH');
     if(username !=='Anupam'){
    console.log('AUTHDone');
        return res.status(401).json({ error: 'Unauthorized' });
     }else{
         next();
     } 
   } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
   }
}

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
const doUserExist = async({username,password})=>{
//    const user = dataStore.find((user)=>{
//         return user.username === username;
//    })
//    if(user){
//     if(user.password===password){
//        return true;
//     }
//    }else{
//     return false;
//    }

    const user =await User.findOne({username:username});
    console.log('USER->'+user);
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

app.post('/signin',(req,res)=>{
    const {username,password} = req.body;
    const doUserEx = doUserExist({username,password});
    if(!doUserEx){
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
        const isUserInDB = doUserExist({username,password});
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