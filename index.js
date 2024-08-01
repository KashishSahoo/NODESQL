const mysql = require("mysql2");
const { faker, tr } = require("@faker-js/faker");
const path = require("path");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");


const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "16108",
  database: "delta_app",
});

app.listen("3000", () => {
  console.log("server is listening on port 3000");
});


//Home Route
app.get("/", (req, res) => {
  let q = ` select count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }
});

//Show Route

app.get("/user",(req,res)=>{
  let q=`select * from user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
       res.render("showusers.ejs",{users});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }
});

//Edit Route(get form)
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]);
      let user=result[0];
       res.render("edit.ejs",{user});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }

});

//Update(DB) Route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let{password:formPass,username:newUsername}=req.body;
  let q=`select * from user where id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]);
      let user=result[0];
      if(formPass !=user.password){
        res.send("wrong pasword");
      }
      else{
        let q2=`update user set username="${newUsername}" where id="${id}"`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }

    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }

});
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});
