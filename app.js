// Requiring express and htpps
const express = require("express");
const app = express();
const https = require("https");

// Body-parser to access input data
app.use(express.urlencoded({ extended: true }));

// Static method in order to access local files like css and images
app.use(express.static("public"));

// Requiring mailchimp
// Also needs "npm install @mailchimp/mailchimp_marketing" on Hyper Terminal
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: "jaskjhfdkafdhgaks-us18", // This is a random key that belongs nobody
  server: "us18",
});

// Sending our main page to root route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Post request (when someone pressed submit button)
app.post("/", function (req, res) {
  // Saving input data into my server
  const fn = req.body.fn;
  const ln = req.body.ln;
  const email = req.body.email;
  console.log(fn + " " + ln + " " + email);

  // Relating my data with Mailchimp's server
  const data = {
    members: [
      // members, email_address, status, merge_fields, FNAME and LNAME
      // are default parameters mailchimp offers.
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fn,
          LNAME: ln,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data); // stringifying data
  const url = "https://us18.api.mailchimp.com/3.0/lists/47cd1b2123"; // lists/(your list key)
  const options = {
    method: "POST", // This is a post method now
    auth: "Ram:514b7a432b92b8d13eb8bbcba9037b96-us18", // "jaskjh..." will be your api key
  };

  // Creating a variable named "request" in order to make https request
  // Further info about https.request() => https://nodejs.org/api/https.html#httpsrequesturl-options-callback
  const request = https.request(url, options, function (response) {
    //use ui feedback
    response.statusCode === 200
      ? res.sendFile(__dirname + "/success.html")
      : res.sendFile(__dirname + "/failure.html");

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  //request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
// Running the server
app.listen(3000, function () {
  console.log("Server is on and ready to wrack baby");
});
