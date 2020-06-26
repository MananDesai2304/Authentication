//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRound = 10;
const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));



mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  email : String,
  password : String
});
//userSchema.plugin(encrypt,{ secret:process.env.SECRET,encryptedFields:["password"] });

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password,saltRound,function(err,hash){
        if(err){
          console.log(err);
        }else{
          const newUser = new User({
            email : req.body.username,
            password : hash
          });
          newUser.save(function(err){
            if(err){
              console.log(err);
            }else{
              res.render("secrets");
            }
          });
        }


    });
  // const newUser = new User({
  //   email : req.body.username,
  //   password : md5(req.body.password)
  // });
  // newUser.save(function(err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.render("secrets");
  //   }
  // });
});

app.post("/login",function(req,res){


    User.findOne({email:req.body.username},function(err,foundUser){
        if(err){
          console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(req.body.password,foundUser.password,function(err,result){
                  if(result){
                      res.render("secrets");
                  }else{
                    res.send("Enter Correct Password");
                  }
                });
            }else{
              res.send("No User Found");
            }

        }
    });
});


app.listen(3000,function(){
  console.log("Server Started At port 3000");
});
