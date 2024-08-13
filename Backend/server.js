import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import admin from './models/admin.js';
import employee from './models/employee.js'



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const DBName = "employee"
const mAdmin = "admin"

// MongoDB connection
mongoose.connect("mongodb+srv://abhishekbmarathe:ZqzcppLmZUYfjSl0@testdb.j0frvll.mongodb.net/" + DBName + "?retryWrites=true&w=majority")
  .then(async () => {
    console.log("MONGODB connection successful :)");

    // Check if initial user exists, if not, create it
    const initialUser = await admin.findOne({ username: mAdmin });
    if (!initialUser) {
      const newUser = new admin({
        username: 'admin',
        password: '123',
      });
      await newUser.save();
      console.log('Initial user created:', newUser);
    }
  })
  .catch((err) => {
    console.log("MONGODB connection Failed...", err);
  });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await admin.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid username or password" });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ status: false, message: "Invalid username or password" });
    }

    // If username and password are correct, send a success response
    res.status(200).json({ status: true, message: "Login successful" });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: false, message: "An error occurred during login" });
  }
});

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/createEmployee', upload.single('img'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }

    const { name, email, mobile, designation, gender, course, username } = req.body; // Include username in the destructuring
    const imgBuffer = req.file.buffer; // Read the image buffer

    // Convert the image buffer to a Base64 string
    const imgBase64 = imgBuffer.toString('base64');

    // Check for duplicate email
    const existingEmail = await employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ status: false, message: 'Email already exists' });
    }



    // Create a new employee record
    const newEmployee = new employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      username, // Include username in the new employee object
      img: imgBase64, // Store the Base64 image string
    });

    // Save the employee to the database
    await newEmployee.save();

    res.status(201).json({ status: true, message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});


// Route to fetch all employee data
app.get('/api/fetchEmployees', async (req, res) => {
  try {
    const employees = await employee.find();
    res.status(200).json({ status: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});


app.put('/api/updateEmployee/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updatedData = req.body;

      // Extract the email and username from the request body
      const { email, username } = updatedData;

      console.log(updatedData);

      // Check for duplicate email, excluding the current employee
      const existingEmail = await employee.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
          return res.status(400).json({ status: false, message: 'Email already exists' });
      }


      // Update the employee in the database
      const updatedEmployee = await employee.findByIdAndUpdate(id, updatedData, { new: true });

      if (updatedEmployee) {
          res.status(200).json({ status: true, message: 'Employee updated successfully', data: updatedEmployee });
      } else {
          res.status(404).json({ status: false, message: 'Employee not found' });
      }
  } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ status: false, message: 'Server error' });
  }
});



// Delete employee route
app.delete('/api/deleteEmployee/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const deletedEmployee = await employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }

    res.json({ status: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
