
require("dotenv").config();
const http = require("http");
const fs = require("fs");
var requests = require("requests")

const homefile = fs.readFileSync("home.html", "utf-8");
const replaceval = (tempval, orgval) => {
  let temp = tempval.replace("{%tempval%}", parseInt(orgval.main.temp-273));
  temp = temp.replace("{%tempmin%}", parseInt(orgval.main.temp_min-273));
  temp = temp.replace("{%tempmax%}", parseInt(orgval.main.temp_max-273));
  temp = temp.replace("{%location%}", orgval.name);
  temp = temp.replace("{%country%}", orgval.sys.country);
  return temp;
};


const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Chandigarh&appid=aa531a674b35d4810c352bd3f0232a87`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        //   console.log(arrdata[0].main.temp)
        const realtimedata = arrdata
          .map((val) => replaceval(homefile, val)).join(" ");
        //    console.log(realtimedata)
        res.write(realtimedata);
      })

      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
    } 
    else
    {res.end("file not found");}
  
});

server.listen(7000, "127.0.0.1");
