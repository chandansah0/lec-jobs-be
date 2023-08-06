const express = require("express");

const fs = require("fs");

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { stringify } = require("querystring");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 5001;
//http://localhost:5001 or http://localhost:5000/

// connection string
const mongoDbURI = "mongodb://localhost:27017/lec";
mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  username: { type: String, unique: true },
  password: String,
  fullname: String,
  lastname: String,
  title: String,
  skills: [{ type: String }],
  address: String,
  job_type: String,
  id: Number,
  is_active: Boolean,
  followers: [{ type: String }],
  followings: [{ type: String }],
});

const User = mongoose.model("user", userSchema);

const userSchemaposts = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  job_type: String,
  pay_rate_per_hr_dollar: Number,
  skills: [{ type: String }],
  liked_by: [{ type: String }],
  viewed_by: [{ type: String }],
  id: Number,
  user_id: Number,
  post_by_username: String,
  post_by_fullname: String,
  post_date: Number,
  comments: [{ type: String }],
});

const Post = mongoose.model("posts", userSchema);

// Post.create(
//   {
//     title: "PHP Developer Required",
//     description: "For a client project PHP Developer is required",
//     location: "Kathmandu",
//     job_type: "Full Time",
//     pay_rate_per_hr_dollar: 10.0,
//     skills: ["PHP", "JS", "HTML"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 2,
//     user_id: 1,
//     post_by_username: "test123",
//     post_by_fullname: "Test User",
//     post_date: "2023-06-10T09:24:07.659034",
//     comments: [],
//   },
//   {
//     title: "Js Developer Required",
//     description: "For a client project PHP Developer is required",
//     location: "Lalitpur",
//     job_type: "Full Time",
//     pay_rate_per_hr_dollar: 10.0,
//     skills: ["PHP", "JS", "HTML"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 3,
//     user_id: 2,
// post_by_username: "test321",
//     post_by_fullname: "Test User2",
//     post_date: "2023-06-10T21:51:10.643105",
//     comments: [],
//   },
//   {
//     title: "Wordpress Developer Required",
//     description: "For a client project PHP Developer is required",
//     location: "Bhaktapur",
//     job_type: "Full Time",
//     pay_rate_per_hr_dollar: 10.0,
//     skills: ["PHP", "JS", "HTML"],
//     liked_by: ["test111", "test1", "test123"],
//     viewed_by: ["test111", "test1", "test123"],
//     id: 4,
//     user_id: 3,
//     post_by_username: "test111",
//     post_by_fullname: "Test User2",
//     post_date: "2023-06-10T21:53:40.698655",
//     comments: [],
//   }
// ).then(() => {
//   console.log("posts created");
// });

app.get("/", (req, res) => {
  res.status(200).send("This is a resonse from BE");
});

// read file and send content of file as resonse
app.get("/api/v1/posts", (req, res) => {
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});

app.post("/api/v1/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
    is_active: true,
  });
  if (user) {
    res.status(200).send({ message: "Login successfull", data:user });
  } else {
    res.status(400).send({ error: "Invalid username or password" });
  }
});
app.get("/api/v1/user", async (req, res) => {
   //const user = fs. readFileSync("./data/user.json", "utf-8").toString();
   const user = await User.find({ id: 1 });   res.status(200).send(user[0]);
});
app.post("/api/v1/user", async (req, res) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });
  const { username, email, fullname, job_type, skills, address, password, title } =
    req.body;
  
  const usernameUser = await User.findOne({username})
  if (usernameUser) {
    return res.status(400).send({ error: "username already exist" });
  }
  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser = {
    email,
    password,
    username,
    fullname,
    title,
    skills,
    address,
    job_type,
    id,
    is_active: true,
    followers: [],
    followings: [],
  };

  User.create(newUser)
    .then((createdUser) => {
      console.log("User Created");
      res.status(200).send(createdUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "can not process your request" });
    });
});

app.listen(PORT, () => {
  console.log("App is running on port" + PORT);
});
