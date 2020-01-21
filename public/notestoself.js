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