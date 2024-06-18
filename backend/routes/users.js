const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) {
      return res.json("error");
    } else {
      res.send(data);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM books WHERE id = ?", [id], (err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
});







module.exports = router;
