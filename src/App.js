const express = require("express");

const fs = require("fs");

const cors = require("cors");
const mongoose = require("mongoose");
const { stringify } = require("querystring");

const app = express();

app.use(cors());

const PORT = 5001;
//http://localhost:5001 or http://localhost:5000/

// connection string
const mongoDbURI = "mongodb://localhost:27017/lec";
mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

 const userSchema = new mongoose.Schema ({ 
  email:String,
  username:String,
  fullname: String,
  tittle:  String,
 skills:[{type: String}],
 address: String,
 job_type: String,
 id:Number,
 is_active: Boolean,
 followers:[{type: String}],
 following:[{type: String}],
 });

const user = mongoose.model("user", userSchema);
user.createCollection()
  .then(col => {
    console.log("Collection created");
  });

  user.create({"email":"test@test.com",
  "username": "chandan-pic",
  "fullname":"Chandan Prasad Sah",
  "tittle":"Software Developer",
  "skills":["JS","PHP","JAVA"],
  "address":"kathmandu,Nepal",
  "job_type":"Full Time",
  "id": 1,
  "is_active":true,
  "followers":[ "username123","user234","user534"],
  "following":["username123","user234","user534","user555"],
}).then(col=> {
  console.log("user creation");
});

app.get("/", (req, res) => {
  res.status(200).send("This is a response from BE");
});

// read file and send content of file as response
app.get("/api/v1/posts", (req, res) => {
  const posts = fs. readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});

app.get("/api/v1/user", (req, res) => {
  const user = fs. readFileSync("./data/user.json", "utf-8").toString();
  res.status(200).send(user);
});

app.listen(PORT, () => {
  console.log("App is running on port" + PORT);
});