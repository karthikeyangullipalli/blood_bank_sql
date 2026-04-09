const mysql= require("mysql2");
const db= mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"Karthikeyan@4221",
  database:"blood_donation"
});
module.exports=db;