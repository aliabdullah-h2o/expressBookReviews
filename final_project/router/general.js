const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username, password)=>{
    let validUsers = users.filter((user)=>{ 
        if (user.username === username && user.password === password ){
            return true;
        } else{
            return false;
        }
    })
    if (validUsers.length >0){
        return true;
    } else{
        return false;
    }

}

public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (username && password){
        if (!doesExist(username, password)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "Successfully Registered!"});
        } else{
            return res.status(404).json({message: "User already exists!"});  
        }
    } else{
        return res.status(404).json({message: "Unable to register user."});

    }
});

// Get the book list available in the shop using callback

// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books));
//   return res.status(200).json({message: "Success!"});
// });

//Get the book list available in the shop using promise
const getAllBooks = new Promise((resolve, reject)=>{
    resolve(books);
})

public_users.get('/', async function (req, res) {
    getAllBooks.then((resBooks) =>{res.send(resBooks)});
  });


// Get book details based on ISBN using callback
// public_users.get('/isbn/:isbn',function (req, res) {
//   let isbn = req.params.isbn;
//   res.send(JSON.stringify(books[isbn]));
//   return res.status(200).json({message: "Success!"});
//  });

 //Get book details based on ISBN using promise
 
const getBookWithISBN = function(isbn){
    return new Promise((resolve, reject)=>{
        resolve(books[isbn]);
    })
};

public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getBookWithISBN(isbn).then((book)=>{
      res.send(JSON.stringify(book));
    });
});
  
// Get book details based on author using callback
// public_users.get('/author/:author',function (req, res) {
//     let author = req.params.author;
//     let resBooks = []; 
//     for (const isbn in books){
//       if (books[isbn].author === author){
//           resBooks.push(books[isbn]);
//       }
//     }
//     res.send(JSON.stringify(resBooks));
//     return res.status(200).json({message: "Success!"});
// });

//Get book details based on author using promise
const getBooksWithAuthor = function(author){
    return new Promise((resolve, reject)=>{
        let resBooks = []; 
        for (const isbn in books){
          if (books[isbn].author === author){
              resBooks.push(books[isbn]);
          }
        }
        resolve(resBooks);
    })
};
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    getBooksWithAuthor(author).then((resBooks)=>{
        res.send(JSON.stringify(resBooks));
    });
});


// Get all books based on title using callback
// public_users.get('/title/:title',function (req, res) {
//     let title = req.params.title;
//     let resBooks = []; 
//     for (const isbn in books){
//       if (books[isbn].title === title){
//           resBooks.push(books[isbn]);
//       }
//     }
//     res.send(JSON.stringify(resBooks));
//     return res.status(200).json({message: "Success!"});
// });

// Get all books based on title using promise
const getBooksWithTitle = function(title){
    return new Promise((resolve, reject)=>{
        let resBooks = []; 
        for (const isbn in books){
          if (books[isbn].title === title){
              resBooks.push(books[isbn]);
          }
        }
        resolve(resBooks);
    })
};
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    getBooksWithTitle(title).then((resBooks)=>{
        res.send(JSON.stringify(resBooks));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
    return res.status(200).json({message: "Success!"});
});

module.exports.general = public_users;
