const express = require('express');
const colors = require('colors')
const dotenv = require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware')

const connectDB = require('./config/db.js');
const multer = require("multer");
const path = require('path');


const port = process.env.PORT || 5000;

// Calling database
connectDB();

// Initialize express
const app = express();

// Initializing Cross-Origin Resource Sharing
app.use(cors());

// Middleware  :: to read body data
app.use(express.json())  // bodyParse for raw json
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "/images")));


// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Posts Routes
app.use('/api/posts', require('./routes/postRoutes'));




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});


app.use(errorHandler);

// Listening
app.listen(port, () => console.log(`Server start at port http://localhost:${port}`))