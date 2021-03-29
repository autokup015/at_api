const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

const port = process.env.PORT || 3000;

const book = require("./data/book.json");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(book);
});

app.post("/book", (req, res) => {
  book.push({ id: req.body.id++, name: req.body.name });
  res.json(req.body);
});

app.listen(port, () => {
  console.log("Port start at port : ", port);
});
