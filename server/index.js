const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');

// Services
const connectDB = require("./services/database");

const app = express();

dotenv.config({ path: './.env' });

app.use(cors({ credentials: true, origin: process.env.APP_URL }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Setup static file to serve index.html from /client/build
// app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React 
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });


app.use('/auth', authRouter);
app.use('/', userRouter);
app.use('/', messageRouter);

app.listen(process.env.PORT, () => {
    console.log(`App listening on at http://localhost:${process.env.PORT}`);
})