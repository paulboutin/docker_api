const fs = require('fs');
const Cachedfs = require('cachedfs');
const cachedfs = new Cachedfs();

const helpers = {

    // helper methods
    readFile : (callback, returnJson = false, filePath, encoding = 'utf8') => {

        cachedfs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    },

    writeFile : (fileData, callback, filePath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
            // Clear the chache we have an update
            console.log(cachedfs.getCacheKey(filePath));
            cachedfs.cache.reset();
            callback();
        });
    }

}

module.exports = helpers;