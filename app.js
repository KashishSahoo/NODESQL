const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");

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

let q = "INSERT INTO user (id,username,email,password) VALUES ?";
let data=[];
for(let i=1;i<=5;i++){
  data.push( getRandomUser()); //100 fake users
}

try {
  connection.query(q, [data], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
} catch (err) {
  console.log(err);
}

connection.end();
