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