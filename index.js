const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 2000;

// college database
const collegeConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "college"
});

collegeConnection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("College MySQL Database is connected Successfully");
  }
});

// student database
const studentConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "students"
});

studentConnection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Student MySQL Database is connected Successfully");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// college ID validation
app.post("/verify", (req, res) => {
  const collegeId = req.body.collegeId;

  const sql = "SELECT * FROM colleges WHERE college_id = ?";

  collegeConnection.query(sql, [collegeId], (err, result) => {
    if (err) {
      console.error("Error executing college query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "College ID not found" });
    } else {
      res.redirect('/')
    }
  });
});
app.get("/", function(req, resp) {
    resp.sendFile(__dirname + "/login.html");
});
// student login
app.post("/login", (req, res) => {
  const studentId = req.body.studentId;
  const password = req.body.password;

  const sql = "SELECT * FROM students WHERE id = ? AND password = ?";

  studentConnection.query(sql, [studentId, password], (err, result) => {
    if (err) {
      console.error("Error executing student query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});