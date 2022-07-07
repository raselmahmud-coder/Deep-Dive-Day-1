const handler = {};
handler.sampleHandler = (requestProperties, cb) => {
  // console.log(requestProperties);
  cb(200, {
    message: "this is a sample url",
  });
};

module.exports = handler;
