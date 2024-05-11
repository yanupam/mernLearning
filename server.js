const express = require("express");

const app = express();
app.use(express.json());
const userRouter = require('../mernLearning/routes/user')
app.use('/user',userRouter);













app.use((err, res, req, next) => {
  res.status(500).json({ message: "INTERNAL SERVER ERROR" });
});

app.listen(3000, () => {
  console.log("Server runnig on PORT-> 3000");
});
