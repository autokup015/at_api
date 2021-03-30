const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

const port = process.env.PORT || 3000;

const book = require("./data/book.json");

// axios
const axios = require("axios");

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
  res.send("Hello api from AT");
});
// ====
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body);
  axios
    .get(
      "https://script.google.com/macros/s/AKfycbwp6gBjY1GFab1l9y9hQFCW3p7wqdCmzpbJlmChUEdP9APVDA/exec?path=/cer"
    )
    .then((result) => {
      let re = result.data.items;
      for (let i = 0; i < re.length; i++) {
        const ele = re[i];
        if (username == ele.username && password == ele.password) {
          res.send(ele);
        }
      }
      res.send("Not found");
    });
});

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
