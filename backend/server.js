const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv');
const path = require('path');
const todoRouters = require('./routes/todoRoutes.js');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRouters);
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

mongoose.connect(process.env.mongodb || 'mongodb://127.0.0.1:27017/todo').then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



 const port =process.env.PORT || 5000;
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
 });