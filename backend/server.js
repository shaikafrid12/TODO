const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv');
const path = require('path');
const todoRouters = require('./routes/todoRoutes.js');


dotenv.config();
const app = express();

// Allow all origins for CORS. For a production application, you should
// restrict this to the specific URL of your frontend.
app.use(cors({
  origin: "https://todo-qfl7.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use('/api/todos', todoRouters);

// Add root route to avoid 404 on backend root URL
app.get('/', (req, res) => {
  res.send('Backend API is running');
});
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

mongoose.connect(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/todo').then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



const port = process.env.PORT || 5000;
 app.listen(port,()=> {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
 });