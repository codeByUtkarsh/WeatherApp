const http = require("http");
const fs = require("fs");
var request = require("requests");
const readline = require("readline");

const homeFile = fs.readFileSync("Home.html", "utf-8");

const replaceVal = (tempFile, orgVal) => {
  if (!orgVal || !orgVal.main || !orgVal.weather || !orgVal.weather[0]) {
    // Handle the case where orgVal or its properties are undefined
    return "Check your city name :)"; // or some other appropriate error message
  }
  let temperature = tempFile.replace(
    "{%tempVal%}",
    (orgVal.main.temp - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempMin%}",
    (orgVal.main.temp_min - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempMax%}",
    (orgVal.main.temp_max - 273.15).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);

  return temperature;
};
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    r1.question("Enter city name :", (city) => {
      const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=84fe33ace8f2ea7ff63c6b6f49b4d211`;
      request(apiurl)
        .on("data", (chunk) => {
          const objData = JSON.parse(chunk);
          const arr = [objData];
          // console.log(objData);
          const realTime = arr.map((val) => replaceVal(homeFile, val)).join("");
          res.write(realTime);
        })
        .on("end", (err) => {
          if (err) {
            res.end("<h1>Internal Server Error</h1><p>" + err.message + "</p>");
          } else {
            res.end();
          }
          r1.close();
        })
        .on("error", (err) => {
          r1.close();
        });
    });
  }
});

server.listen(8000, () => {
  console.log("Server is listening to the port no = 8000");
});
