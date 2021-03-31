const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

const port = process.env.PORT || 3000;

// axios
const axios = require("axios");

//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");

// SMS Vonage
const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "e972def6",
  apiSecret: "TXya3s97Q0iKsx1V",
});

// Mandrill api
const mandrill = require("mandrill-api/mandrill");
const mandrill_client = new mandrill.Mandrill("qMwNZlQXlDXanRfL1MmXZQ");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Default For check API

app.get("/", (req, res) => {
  res.send("Hello api from AT");
});

// Login for get Certificate by sheet online

app.post("/api/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
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

// SMS Vonage

app.post("/api/sms", (req, res) => {
  const from = "IN2IT Company";
  let number = req.body.to.substring(1);
  const to = "66" + number;
  const text = req.body.text;

  vonage.message.sendSms(from, to, text);
});

// Generate PDF certificate

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

// Send email by mandrill and mailchilm

app.post("/api/email", (req, res) => {
  let templateName = req.body.templatename;
  let subject = req.body.subject;
  let fromemail = req.body.fromemail;
  let fromname = req.body.fromname;
  let toemail = req.body.toemail;

  var template_name = templateName;
  var template_content = [
    {
      name: templateName,
      content: "example content",
    },
  ];
  var message = {
    html: "<p>Example HTML content</p>",
    text: "Example text content",
    subject: subject,
    from_email: fromemail,
    from_name: fromname,
    to: [
      {
        email: toemail,
        name: "Recipient Name",
        type: "to",
      },
    ],
  };
  var async = false;

  mandrill_client.messages.sendTemplate({
    template_name: template_name,
    template_content: template_content,
    message: message,
    async: async,
  });

  res.send(":)");
});

app.listen(port, () => {
  console.log("Port start at port : ", port);
  console.log(
    "================================================================"
  );
});
