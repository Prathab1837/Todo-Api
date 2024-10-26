//Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//Create an instance of express
const app = express();
//middleware to understand the json format
app.use(express.json())
//use cors for cors policy error
app.use(cors())

//Sample in memory storage for todo items
// let todos = [];

// Connecting mongoDB
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
})
// Creating schema
const todoSchema = new mongoose.Schema({
    title:{
        required: true,
        type: String
    },
    description:String
})
// Creating models
const todoModel = mongoose.model('Todo', todoSchema);

//Create a new todo item (if post request is sent then new data is gonna be created)
app.post('/todos', async (req,res) =>{
    const {title, description} = req.body;
    // const newTodo = {
    //     id : todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);

    } catch (err){
        console.log(err)
        res.status(500).json({message: err.message});
    }

})

//Get all items (if get request is sent then data is fetched)
app.get('/todos', async(req,res) => {
    try {
       const todos = await todoModel.find();
       res.json(todos);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message});
    }
    
})

//Update a todo item 
app.put('/todos/:id', async (req,res) => {
    try {
        const {title , description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title , description},
            {new:true}
        )

        if(!updatedTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedTodo);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message});
    }
})

// Delete a todo item
 app.delete('/todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({message:err.message});
    }
    
 })

 
//Start the server
const port = 8000;
app.listen(port, () => {
    console.log("Server is running at "+ port);
})