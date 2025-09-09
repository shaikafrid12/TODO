const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv');
const todoRouters = require('./routes/todoRoutes.js');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRouters);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.mongodb).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



 const port =process.env.PORT || 3000;
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
 });