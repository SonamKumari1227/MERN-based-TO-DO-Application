const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/merndb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection is successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



const bodyparser = require('body-parser');
const cors = require('cors')

const taskmodel = require("./model/Tasks");


const usermodel = require('./model/user');
const app = express();
app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/getdata', (req, res) => {
    res.send("hello");
})
app.post('/postData', async(req, res) => {
    const { name, email, password } = req.body;
  const user = new usermodel({
    "name": name,
    "email": email,
    "password": password
  });

  try {
      await user.save();
      console.log(name);
      res.json({ success: true });
    
  } catch (error) {
    console.error('Error saving user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})



//Task 
app.post("/addtask", async(req, res) => {
   
    const { task } = req.body;

    const newTask = new taskmodel({
        task: task
    });

    try {
        // Save the new task
        await newTask.save();
        
        // Send a success response to the client
        res.json({ message: "Task saved successfully." });

    } catch (error) {
        // Handle any errors that occur during the save operation
        console.error("Error saving task:", error);
        // Send an error response to the client
        res.status(500).json({ error: "Internal Server Error" });
    }
})
app.get("/allmytask", async (req, res) => {
    try {
        

        console.log("Here are all your tasks");

        // Find all documents using Mongoose's find method
        const allTasks = await taskmodel.find();
    
        // Iterate over the array and log each task
        allTasks.forEach(task2 => {
          console.log(task2.task);
        });
    
        // Send the tasks as a JSON response
        res.json({ tasks: allTasks });
        console.log("all documents printed")
    }
    catch (e) {
        console.log(e);
    }
})

app.post('/deletetask', async (req, res) => {
    const { taskIds } = req.body;
  
    try {
      await taskmodel.deleteMany({ _id: { $in: taskIds } });
      res.json({ message: 'Tasks deleted successfully.' });
    } catch (error) {
      console.error('Error deleting tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      let result = await usermodel.findOne({ email: email });
  
      if (result) {
        // Compare the hashed password from the database with the provided password
        if (result.password === password) {
          console.log("Email and password matched successfully.....");
  
          // Generate a token (optional, use if implementing token-based authentication)
          const token = jwt.sign({ userId: result._id }, 'yourSecretKey', { expiresIn: '180' });
  
          // Include only the token in the response
          res.json({
            token: token,
              loggedIn: true,
            name:result.name
          });
          return; // Return to prevent further execution
        } else {
          console.log("Password mismatch");
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        console.log("Email not found");
        res.status(404).json({ error: "User not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
});
  
app.listen(8000, () => {
    console.log("server is listening......");

})