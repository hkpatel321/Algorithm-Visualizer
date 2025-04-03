const express=require('express');
const app=express();
const port=5000 ;
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const MONGOURL=process.env.MONGO_URL;

main().then(()=>{console.log("Connected to DB")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGOURL);
}

const { Signup,Login } = require("./controllers/AuthController.js");
const {ChatController}=require("./controllers/ChatController.js");
const { userVerification } = require("./middlewares/AuthMiddleware.js");
const chatRoutes = require('./routes/chatRoutes'); 

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.post('/signup',Signup);

app.post('/login',Login);

app.get('/logout', (req, res) => {
  res.clearCookie('token', {
    withCredentials: true,
    httpOnly: false,
  });
  res.json({ message: 'Logged out successfully', success: true });
});

app.get("/history",(req,res)=>{
    res.send("History");
});

app.get("/visualize", userVerification, (req, res) => {
  res.send("Algorithm Visualization");
});

app.get('/api/check-auth', userVerification, (req, res) => {
  res.json({ status: true, user: req.user }); 
});

app.use('/api/chat', chatRoutes); 

app.listen(port,()=>{ 
    console.log(`Server is running on port ${port}`);
});

