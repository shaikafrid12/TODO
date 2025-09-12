const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv');
const path = require('path');
const todoRouters = require('./routes/todoRoutes.js');


dotenv.config();
const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://todo-frontend-aoyx.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api/todos', todoRouters);

// Add root route to avoid 404 on backend root URL
app.get('/', (req, res) => {
  res.send('Backend API is running');
});
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend-dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-dist', 'index.html'));
});

mongoose.connect(process.env.mongodb || 'mongodb://127.0.0.1:27017/todo').then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



const port = 5000;
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
 });