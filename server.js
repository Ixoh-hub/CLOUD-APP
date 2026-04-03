const express = require("express");
const pool = require("./db");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Blog API is running...");
});


// CREATE post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const result = await pool.query(
      "INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to create post", detail: err.message || err.toString() });
  }
});


// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});


// GET single post
app.get("/posts/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


// UPDATE post
app.put("/posts/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const result = await pool.query(
      "UPDATE posts SET title=$1, content=$2, author=$3 WHERE id=$4 RETURNING *",
      [title, content, author, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


// DELETE post
app.delete("/posts/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.json("Post deleted");
  } catch (err) {
    console.error(err.message);
  }
});


// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});