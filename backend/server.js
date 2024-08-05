//Using Express

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./Routes/AdminRoute');


//create an instance of express
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use('/auth', auth)


// let todos = [];

//connect mongodb
mongoose.connect("mongodb://localhost:27017/mern-app")
.then(() => {
    console.log('DB Connected');
})
.catch((err) => {
    console.log(err);
})



//Start the server

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log("Server is listining tp port " + port);
})