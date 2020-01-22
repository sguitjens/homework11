app.delete("/api/notes/:title", (req, res) => {
  console.log("DELETE NOTES ROUTE");
  // console.log("delete res", JSON.parse(res).id);
  let data = fs.readFileSync("./db/db.json", "utf8");
    data = JSON.parse(data);
    data.forEach((element, index, data) => {
      // console.log("obj", element);
      // console.log("INDEX", index);
      // console.log("BLA", req.params.id);
      res = 0;
      if(element.id == req.params.id) {
        res =  data.splice(index, 1);
        // will still need to write back to the file
        console.log("DATA2", data);
        console.log("DATA3", JSON.stringify(data));
        fs.writeFileSync("./db/db.json", JSON.stringify(data), "utf8");
        // return res;
      }
    })
  // })
  return res;
});


// When someone visits any path that is not specifically defined, this function is run.
function display404(url, res) {
  var myHTML = "<html>" +
    "<body><h1>404 Not Found </h1>" +
    "<p>The page you were looking for: " + url + " can not be found</p>" +
    "</body></html>";
  // Configure the response to return a status code of 404 (meaning the page/resource asked for couldn't be found), and to be an HTML document
  res.writeHead(404, { "Content-Type": "text/html" });
  // End the response by sending the client the myHTML string (which gets rendered as an HTML document thanks to the code above)
  res.end(myHTML);
}



// Farani Lucero  10:45 AM
// Hi Sydney, please try these changes to server.js
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
          console.log("POST RETURNS", false);
          return false;
        }
        // else res.json({didItWOrk: true}) // I don't understand what's happening here
        else {
          console.log("DATA", data);
          console.log("POST RETURNS", true);
          res.json(data);
          return true;
        };
      });
    };
  });
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE NOTES ROUTE");
  // console.log(req.params.id); // this is the id
  let id = req.params.id;
  fs.readFile("./db/db.json", "utf8",(err, data) => { 
    if(err) {
      console.log("ERROR ON READ", err);
      return 0;
    }
    else {
      data = JSON.parse(data);
      data.forEach((element, index, data) => {
        // console.log("ELEMENT.ID", element.id);
        // console.log("REQ.PARAMS.ID", req.params.id);
        if(element.id == id) {
          data.splice(index, 1);
          //console.log("RES", res);
          // write back to the file
          console.log("DATA2", data);
          console.log("DATA3", JSON.stringify(data));
          fs.writeFile("./db/db.json", JSON.stringify(data), err => {
            if (err) {
              return false;
            }
            res.json(data);
            return true;
          }); // only need to write to the file if there's something to delete
        };
      });
    };
  });
});

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

// SERVER ROUTES //
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
    };
    // console.log(data)
    res.json(JSON.parse(data)); // what is happening here? are we setting the response to JSON.parse(data) and returning it?
    return res;
    // console.log(res);
  });
});


