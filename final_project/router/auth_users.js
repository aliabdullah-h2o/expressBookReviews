const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (authenticatedUser(username,password)){
    if (!username && !password){
        return res.status(404).json({message: "Error logging in"});
    }
    let accessToken = jwt.sign({
        data:password}, 'access',{expiresIn:60*60}
    );
    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).json({message: "Successfully Logged in!"});
  } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let review = req.query.review;
    if (JSON.stringify(books[isbn].reviews) === "{}"){
        books[isbn].reviews = [{"username":req.session.username, "review": review}];
    
    } else{
        let found = false
        for (let i=0; i<books[isbn].reviews.length; i++){
            if (books[isbn].reviews[i].username === req.session.username){
                found = true;
                books[isbn].reviews[i].review = review;
            }
        }
        if (!found){
            books[isbn].reviews.push({"username":req.session.username, "review": review});
        }
    }
    return res.status(200).json({message: "Review Successfully Added!"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    books[isbn].reviews = books[isbn].reviews.filter((val) =>{
        if (val.username != req.session.username){
            return val;
        }
    })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
