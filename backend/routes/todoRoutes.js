const express =require('express');
const Todo=require('../model/todo.js');
const { todo } = require('node:test');

const router = express.Router();


router.get("/",async(req,res)=>{
    const todos= await Todo.find();
    res.json(todos);
});

router.post("/",async(req,res)=>{
    const newTodo=new Todo({text:req.body.text});
    await newTodo.save();
    res.json(newTodo);
});



router.put("/:id",async(req,res)=>{
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
});


router.delete("/:id",async(req,res)=>{
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.json(todo);
});

router.delete("/",async(req,res)=>{
    await Todo.deleteMany({completed: true});
    const todos = await Todo.find();
    res.json(todos);
});


module.exports=router;