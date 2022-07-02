const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("hello node js server");
    res.end();
  } else if (req.url === "/events") {
    res.write("hello events pages");
    res.end();
  } else {
    res.write("not found");
    res.end();
  }
});

const listener = server.listen(5000);
console.log(`server is running at`, listener.address().port);
