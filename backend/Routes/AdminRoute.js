const express = require('express');
const jwt = require('jsonwebtoken');
const user = require('../model/userModel');
const List = require('../model/ListModel');
require('dotenv').config();



const router = express.Router();

// Use a secret key from environment variables or hardcode for testing (not recommended)


router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        // Find user by name
        const foundUser = await user.findOne({ name });

        if (!foundUser) {
            return res.status(404).json({loginStatus: false, Error: "No user found!"});
        }

        // Check if password matches
        if (foundUser.password !== password) {
            return res.status(400).json({loginStatus: false, Error: "The username or password is incorrect"});
        }

        // Generate JWT token
        const token = jwt.sign({ role: "admin", name: foundUser.name }, "jwt_secret_code_key", { expiresIn: "1d" });

        // Send token as a cookie
        res.cookie('token', token, { httpOnly: true }); // httpOnly helps prevent XSS attacks
        res.status(200).json({loginStatus: true});
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
});



//create an List
router.post('/lists', async (req, res) => {
    const {title, subject, mark} = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {
        const newList = new List({title, subject, mark})
        await newList.save();
        res.status(200).json(newList);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})


//Get all the Lists
router.get('/lists', async (req, res) => {
    try {
       const lists = await List.find();
       res.json(lists);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


//update an todo item
router.put('/lists/:id', async (req, res) => {
    try {
        const {title, subject, mark} = req.body;
        const id = req.params.id;
        const updatedList = await List.findByIdAndUpdate(
            id,
            { title, subject, mark },
            { new: true }
        )
        if(!updatedList){
            return res.status(404).json({message: "List not found"})
        }
        res.json(updatedList)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
   
})

//Delete a todo item
router.delete('/lists/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await List.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }

})


router.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(201).json({status: true, message: "Loggedout Successfully"});
})


module.exports = router;
