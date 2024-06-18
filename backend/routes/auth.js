require("dotenv").config();

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const db = require("../db");

router.post("/student-signin", async(req, res) => {

  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO student(`firstname`,`lastname`,`email`,`password`) values(?)";
    const values = [firstname, lastname, email, hashedPassword];

    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.json({ error: "Error inserting data into the database" });
      }
      return res.json({ message: "Student signed in successfully", data });
    });
  } catch (error) {
    console.error("Error during student sign-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
 
router.post("/student-login", (req, res) => {
  const sql = "SELECT * FROM student WHERE `email`=?";
  const values = [req.body.email];

  db.query(sql, values, async (err, data) => {
    if (err) {
      return res.json("error");
    }

    if (data.length > 0) {
      const user = data[0];
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (isPasswordValid) {
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ accessToken: accessToken });
      } else {
        return res.status(401).json("Invalid email or password");
      }
    } else {
      return res.status(401).json("Invalid email or password");
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
