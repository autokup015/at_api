const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const book = require("./data/book.json");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json(book);
});

app.post("/book", (req, res) => {
  book.push(req.body);
  res.json(req.body);
});

app.listen(port, () => {
  console.log("Port start at port : ", port);
});
