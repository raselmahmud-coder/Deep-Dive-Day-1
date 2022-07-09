// dependency
const fs = require("fs");
const path = require("path");
const lib = {};
lib.baseDir = path.join(__dirname, "/../.data/");
// write data to file
lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("error occurred in the close the new file!");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("it may already exist" + err);
      }
    }
  );
};
// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};
// data update from existing file
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir + dir}/${file}.json`, "r+", (err, descriptor) => {
    if (!err && descriptor) {
      // convert the data to string
      const stringData = JSON.stringify(data);
      // truncate the file that's mean need to empty
      fs.ftruncate(descriptor, (err) => {
        if (!err) {
          // write to the file and close it
          fs.writeFile(descriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(descriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("error closing file");
                }
              });
            } else {
              callback("error occurred when writing the file");
            }
          });
        } else {
          callback("error truncating file");
        }
      });
    } else {
      callback("error updating file may not exist");
    }
  });
};
// data delete from existing file
lib.delete = (dir, file, callback) => {
  // unlink file that's mean will delete the file data
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
      if (!err) {
        callback(false);
      } else {
        callback("there was a system error");
      } 
      
  });
};
module.exports = lib;
