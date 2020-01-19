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