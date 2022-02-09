// Importing data.json
const data = require("./data.json");

// Importing fs to write to file
const fs = require("fs");

// Using express server
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// GET route for data
app.get("/get_data", (req, res) => {
  console.log("GET data");
  res.send({ data: data });
});

// POST route for updating data
app.post("/update_data", function (req, res) {
  console.log("POST data");
  const resp = [];
  const companies = data;
  const updatedJSON = companies.map((company) => {
    if (company.name === req.body.name) {
      company.website = req.body.website;
      company.description = req.body.description;
      resp.push(company);
    }
    return company;
  });
  let toWrite = JSON.stringify(updatedJSON);
  fs.writeFile("data.json", toWrite, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
  res.json({ resp });
});
