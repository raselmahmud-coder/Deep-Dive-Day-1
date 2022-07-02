const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form action="/process" method="post">
            <input type="text" name="message" id="">
        </form>
    </body>
    </html>`);
    res.end();
  } else if (req.url === "/process" && req.method === "POST") {
      let body = [];
    req.on("data", (chu) => {
        body.push(chu);
    });
      req.on("end", () => {
          console.log("stream is finish");
          const parseBuffer = Buffer.concat(body).toString();
          console.log(parseBuffer);
      })
    res.write("thanks for submitting");
    res.end();
  } else {
    res.write("not found");
    res.end();
  }
});

const listener = server.listen(5000);
console.log(`server is running at`, listener.address().port);


