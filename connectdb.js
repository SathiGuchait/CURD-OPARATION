const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const multer=require('multer');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser')




//file uplode
let storage=multer.diskStorage({
  destination:'public/images',
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const uplode=multer({storage:storage})

// Database Name
const dbName = 'myProject';
client.connect();
const db = client.db(dbName)
const collection = db.collection('documents');


const path = require("path");
const app = express();
app.use(cookieParser())
const pat = path.join(__dirname, 'public/index.html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  
  //console.log("sathi");
  res.send(pat);
 // console.log(req.cookies);
  
});
app.post("/register",uplode.single('photo'), async (req, res) => {
  //console.log(req.cookies)
  const {name,email,phone,password,cpassword}= req.body;
  const data = await collection.findOne({ email: email });
  //console.log(req.file,req.body);

  if(data ==null){
    if (password != cpassword) {
      return res.send("password not match");
    }
    try {
      await collection.insertOne({
        "name": name,
        "email": email,
        "phone": phone,
        "password": password,
        "photo": req.file.filename
      });
      res.send('success');
    } catch (err) {
      res.send(err);
    }
  }else{
    res.send("This email is already exsist");

  }
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    //const token=jwt.sign(email)

    const data = await collection.findOne({ email: email });
   // console.log(data);
    if (data.password == password && data.email==email) {
      //res.cookie("sathi", JSON.stringify({email:email,password:password}), {maxAge:100000});
      res.send('login successful');
     // console.log(req.cookies);
    } else {
      res.send("password or email not match");
    }
  } catch (err) {
    console.log(err);
  } 
});
app.post('/forgot', async (req, res) => {
  try {
    const email = req.body.email;
    const newpassword = req.body.password;
    const data = await collection.findOne({ email: email })
    if (data.email == email) {
      await collection.updateOne({ email: email }, { $set: { password: newpassword } })
      console.log("succesful");
      res.send("successfully password change");
    } else {
      console.log("not change something will wrong");
      res.send("not change something will wrong");
    }
  } catch (err) {
    console.log(err);
  }
});


app.post("/delete",async (req,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = await collection.findOne({ email: email })
    console.log(data)
    if(data==null){
      res.send("this email not valid");
    }
    if(data.email==email && data.password==password){
    await collection.deleteOne({password:password});
      console.log("delete your account");
      res.send("delete your account");
    }   
  }catch(err){
    console.log(err)
  }
})
/*
app.get("/users",async (r, res)=>{
 const result=await collection.find();
   // if (err){ throw err};
    console.log(result);

    res.send(result);
});
app.get("/logout",(req,res)=>{
  
    console.log(req.cookies) ;  
    res.clearCookie("sathi");
   // console.log(req.cookies.sathi) ;
})
*/
app.listen(8081, () => {
  console.log("listining to the port 8181")
});
