const express = require("express");
const fs = require('fs');
const router = express.Router();
const helpers = require('../helpers');
const cors = require("cors");

const setcors = cors({
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "*",
  exposedHeaders: "*",
});

/* GET hash file */
router.get("/:vendor", setcors, function (req, res, next) {

  console.log("Get hash for ", req.params.vendor);
  const vendor = req.params.vendor;
  const dataPath = `../data/${vendor}/hash.json`;

  // if Vendor dir doesnt exist return 404
  if (!fs.existsSync(dataPath)){
    return res.status(404).send('Faild! ' + vendor + ' not found on BOTW server.');
  }

  helpers.readFile((data) => {

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
    res.send(data);

  }, true, dataPath);

});

/* SAVE hash file */
router.post('/:vendor', (req, res) => {

  const data = req.body;
  const vendor = req.params.vendor;
  const dataPath = `../data/${vendor}`;
  const dataFilePath = `${dataPath}/hash.json`;
  const schemaPath = `../schemas/${vendor}.schema`;
  const dateParse = Date.parse(new Date());
  const dataPathArchive = `../data/archive/${vendor}-${dateParse}.json`;

  // if Vendor Schema doesnt exist skip validation
  if (!fs.existsSync(schemaPath)){

    saveHash(vendor, data, dataPath, dataFilePath, dataPathArchive, (status) => {
  
      return res.status(status.code).send(status.message);

    });

    return;
  }

  helpers.readFile(schema => {

    const JsonValidator = require('jsonschema').Validator;
    console.log('request body', data);
    const validator = new JsonValidator();
    const validatorResult = validator.validate(data, schema);
    console.log(vendor, 'schema valid', validatorResult.valid);

    if (validatorResult.valid) {
  
      saveHash(vendor, data, dataPath, dataFilePath, dataPathArchive, (status) => {
        return res.status(status.code).send(status.message);
      });

    } else {

      return res.status(406).send('Faild! New ' + vendor + ' hash is invalid. Unable to push to BOTW server.');

    }

  }, true, schemaPath);

});

const saveHash = (vendor, data, dataPath, dataFilePath, dataPathArchive, callback) => {

  // if Archive dir doesnt exist create it
  if (!fs.existsSync('../data/archive/')){
    fs.mkdirSync('../data/archive/');
  }
  
  //Write to archive
  helpers.writeFile(JSON.stringify(data, null, 2), () => {}, dataPathArchive);

  // if Vendor dir doesnt exist create it
  if (!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
  }

  helpers.writeFile(JSON.stringify(data, null, 2), () => {

    callback({code: 200, message: `Success! New ${vendor} hash has been pushed to BOTW Server.`});

  }, dataFilePath);
};

module.exports = router;