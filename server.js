const express =require('express')
const app = express();
app.use(express.json());
//mongodb+srv://anupam:lucknow01@anupam.2pe6v1t.mongodb.net/
let dataStore = [
    {   
        id:1,
        name:'Anupam',
        age:24
    },
    {
        id:2,
        name:'Anuradha',
        age:22
    }
];

const authMiddleWare = (req,res,next)=>{
   try {
    const username = req.headers.username;
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


app.get('/get',authMiddleWare,(req,res)=>{
    const id = req.query.id;
    for(let listData of dataStore){
        if(listData.id == id){return  res.status(200).send(listData);} 
    }
  
})

app.post('/post',(req,res)=>{
    const reqBody = req.body;
    dataStore = [...dataStore,reqBody];
    res.send(dataStore)
})

app.listen(3000);