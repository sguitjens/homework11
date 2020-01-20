const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;
let UNIQUE_ID = "";

// middleware
app.use(express.urlencoded({ extended: true })); // req.params
app.use(express.json()); // req.body
app.use(express.static("public")); // serves public assets

const getMaxID = () => {
  let max = 0;
  console.log("getmaxid");
  // fs.readFile("./db/db.json", "utf8",(err,data) => {
  let data = fs.readFileSync("./db/db.json", "utf8");
    // if(err) return ("ERROR ON FILE READ", err);
  data = JSON.parse(data);
  data.forEach((element, index, data) => {
    if(!element) {
      console.log("ELEMENT HAS NULL VALUE"); // skip null values
    }
    else if(element.id > max) max = element.id;
  });
  // });
  console.log("MAX", max);
  return max;
}

// Server routes
// req: ?
// res: all saved notes as JSON, or 0 if none;
app.get("/api/notes", function(req, res) {
  // res = 0;
  console.log("GET NOTES ROUTE");
  // console.log(req.body);
  fs.readFile("./db/db.json", "utf8",(err,data) => {
    if(err) {
      console.log("ERROR ON GET NOTES", err);
      return 0;
    }
    // console.log(data)
    res.json(JSON.parse(data)); // what is happening here? are we setting the response to JSON.parse(data) and returning it?
    return res;
    // console.log(res);
  });
})

// req: takes a new note (as an object)
// res: returns true or false
app.post("/api/notes", (req, res) => {
  console.log("POST NOTES ROUTE");
  if(!UNIQUE_ID) UNIQUE_ID = getMaxID();
  console.log(UNIQUE_ID);
  UNIQUE_ID += 1;
  req.body.id = UNIQUE_ID; // add unique id to the request
  console.log("REQ", req.body); // should show the note object
  fs.readFile("./db/db.json", "utf8",(err, data) => { // data is an array of objects
    if(err){
      console.log("ERROR IN READFILE", err);
      res = false;
      console.log("POST RETURNS", false);
      return false;
    }
    else {
      data = JSON.parse(data);
      data = data.concat(req.body); // add the request to the data from the file
      data = JSON.stringify(data);
      fs.writeFile("./db/db.json", data, err => {
        if(err) {
          console.log(err);
          res = false;
          console.log("POST RETURNS", false);
          return false;
        }
        // else res.json({didItWOrk: true}) // I don't understand what's happening here
        else {
          console.log("DATA", data);
          res = true;
          console.log("POST RETURNS", true);
          return true;
        } 
      })
    }  
  })
})

// deletes a note by ID and returns success (true) or failure (false)
// req: an id
// res: return deleted note as an object, or 0 if failure
app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE NOTES ROUTE");
  // console.log(req.params.id); // this is the id
  let id = req.params.id;
  res = 0;
  fs.readFile("./db/db.json", "utf8",(err, data) => { 
    if(err) {
      console.log("ERROR ON READ", err);
      return 0;
    }
    else {
      data = JSON.parse(data);
      data.forEach((element, index, data) => {
        // res = 0;
        // console.log("ELEMENT.ID", element.id);
        // console.log("REQ.PARAMS.ID", req.params.id);
        if(element.id == id) {
          res = data.splice(index, 1);
          console.log("RES", res);
          // write back to the file
          console.log("DATA2", data);
          console.log("DATA3", JSON.stringify(data));
          fs.writeFileSync("./db/db.json", JSON.stringify(data), "utf8"); // only need to write to the file if there's something to delete
          return res;
        }
      })
    }
  })
});

// HTML Routes
app.get("/notes", function(req, res) {
  console.log("NOTES HTML ROUTE")
  // console.log("notes url ", req.url)
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function(req, res) {
  console.log("WILDCARD/CATCHALL HTML ROUTE")
  console.log("catch all works ", req.url)
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});



// node server.js