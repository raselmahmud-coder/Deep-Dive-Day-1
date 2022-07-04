const handler = {}
handler.notFoundHandler = (requestProperties, cb) => {
    console.log("not found handler", requestProperties);
    cb(404, {
        message:"request url not founded"
    })
}
module.exports = handler;
