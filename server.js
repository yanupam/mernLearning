const express =require('express')
const app = express();
app.use(express.json());

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
app.get('/get',(req,res)=>{
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