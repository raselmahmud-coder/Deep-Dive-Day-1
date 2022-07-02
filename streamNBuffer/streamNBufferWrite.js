const fs = require("fs");
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const ourReadStream = fs.createReadStream(`${__dirname}/index.txt`);
        // console.log(ourReadStream);
        // res.pipe(ourReadStream)
        ourReadStream.pipe(res)
        // res.write("hello js")
        // res.end()
    }
})
// const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`);
// ourReadStream.on('data', (chunk) => {
//    const chunk1 = ourWriteStream.write(chunk)
//     console.log("hello chunk", chunk1);
// })
// ourReadStream.pipe(ourWriteStream);
const listener = server.listen(4000)
console.log("4000 server port listen", listener.address().port);