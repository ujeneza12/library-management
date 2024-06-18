require("dotenv").config();

const router = require("express").Router();
const jwt = require("jsonwebtoken");

const db = require("../db");

router.post("/student-signin", (req, res) => {
  const sql =
    "INSERT INTO student(`firstname`,`lastname`,`email`,`password`) values(?)";
  const values = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json("error");
    }
    return res.json(data);
  });
}); 

router.post("/student-login", (req, res) => {
  const sql = "SELECT * FROM student where `email`=? AND `password`=?";
  const values = [req.body.email, req.body.password];
  const user = { email: values.email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("error");
    }
    if (data.length > 0) {
      return res.status(200).json({ accessToken: accessToken });

    } else {
      return res.json("failed");
    }
  });
});



// Delete a user
router.delete("/student/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM student WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "User deleted successfully" });
  });
});


module.exports = router;
