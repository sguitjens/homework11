const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
let UNIQUE_ID = "";

// middleware
app.use(express.urlencoded({ extended: true })); // req.params
app.use(express.json()); // req.body
app.use(express.static("public")); // serves public assets

// Determine where to start the unique id
const getMaxID = () => {
  let max = 0;
  // fs.readFile("./db/db.json", "utf8",(err,data) => {
  let data = fs.readFileSync("./db/db.json", "utf8");
    // if(err) return ("ERROR ON FILE READ", err);
  data = JSON.parse(data);
  data.forEach((element, index, data) => {
    if(!element) {
    }
    else if(element.id > max) max = element.id;
  });
  // });
  return max;
}

// SERVER ROUTES //
// req: 
// res: 
// return: all saved notes as JSON, or 0 if none;
app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", "utf8",(err,data) => {
    if(err) {
      console.log("ERROR ON GET NOTES", err);
      return 0;
    };
    // res.json(JSON.parse(data));
    console.log("DATA", data);
    // res.json(data); // this broke the crap out of things - something in the front end
    res.json(JSON.parse(data)); 
    return res;
  });
});

// req: takes a new note (as an object)
// res:
// return: true or false
app.post("/api/notes", (req, res) => {
  if(!UNIQUE_ID) UNIQUE_ID = getMaxID();
  UNIQUE_ID += 1;
  req.body.id = UNIQUE_ID; // add unique id to the request
  fs.readFile("./db/db.json", "utf8",(err, data) => { // data is an array of objects
    if(err){
      console.log("ERROR POSTING NOTE");
      return false;
    }
    else {
      data = JSON.parse(data);
      data = data.concat(req.body); // add the request to the data from the file
      data = JSON.stringify(data);
      fs.writeFile("./db/db.json", data, err => {
        if(err) {
          console.log(err);
          console.log("POST RETURNS", false);
          return false;
        }
        else {
          res.json(data); // put the data into the response object
          return true;
        };
      });
    };
  });
});

// deletes a note by ID and returns success (true) or failure (false)
// req: an id
// res:
// return: the object deleted or zero
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  fs.readFile("./db/db.json", "utf8",(err, data) => { 
    if(err) {
      console.log("ERROR ON READ", err);
      return 0;
    }
    else {
      data = JSON.parse(data);
      data.forEach((element, index, data) => {
        if(element.id == id) {
          data.splice(index, 1); // changes the data in place
          fs.writeFile("./db/db.json", JSON.stringify(data), err => {
            if(err) {
              console.log("ERROR ON DELETE", err);
              return 0;
            };
            res.json(data); // converts the data being returned to json
          });
          return 0;
        };
      });
    };
  });
});

// HTML ROUTES //
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function(req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});

app.get("*", function(req, res) { // catchall
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
