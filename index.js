const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

const port = process.env.PORT || 3000;

const book = require("./data/book.json");

//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(book);
});
// ====
 
app.post("/book", (req, res) => {
  book.push({ id: req.body.id++, name: req.body.name });
  res.json(req.body);
});

app.get("/api/pdf", (req, res) => {
  let nameS = "auto chonlatee";
  var users = [
    {
      name: "AT Sriwichai",
      point: 100,
      date: "31 Match 2021 08.00",
    },
  ];
  var document = {
    html: html,
    data: {
      users: users,
    },
    path: "../" + nameS + ".pdf",
  };
  pdf
    .create(document)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log("Port start at port : ", port);
});
