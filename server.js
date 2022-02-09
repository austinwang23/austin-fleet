const data = require("./data.json");
const fs = require("fs");
console.log(typeof data); // output 'testing'

const express = require("express"); //Line 1
const app = express(); //Line 2
app.use(express.json());
const port = process.env.PORT || 5000; //Line 3

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get("/express_backend", (req, res) => {
  //Line 9
  res.send({ data: data }); //Line 10
}); //Line 11

app.post("/update", function (req, res) {
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
  console.log("hi colin");
  console.log(req.body);
  console.log(resp);

  let toWrite = JSON.stringify(updatedJSON);
  fs.writeFile("data.json", toWrite, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
  res.json({ resp });
});
