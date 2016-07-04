var exec = require('child_process').exec;
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var spawnOptions =  {
  'cwd': '/dev/shm'
};
var solcArgs = ' --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,userdoc ';


var showCwd = function () {
  exec('pwd', spawnOptions, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`cwd: ${stdout}`);

    if (stderr.length > 0) {
      console.log(`stderr: ${stderr}`);
    }
  });
};

var compile = function (src) {
  // PoC for running cli solc from node
  return new Promise(function (resolve, reject) {

    // save the input to a temp file
    fs.writeFile(spawnOptions.cwd + "/foo.sol", src, function (err) {
      if (err) {
        reject(Promise.reject(err));
        return;
      }
      resolve();
    });
  }).then(
    function () {
      return true;
    },
    showCwd // note the cwd
  ).then(function () {
    // compile with solc
    return new Promise(function (resolve, reject) {
      exec(`solc foo.sol ${solcArgs}`, spawnOptions, (error, stdout, stderr) => {
        if (error) {
          reject(`exec error: ${error}`);
          return;
        }

        if (stderr.length > 0) {
          console.log(`stderr: ${stderr}`);
        }

        resolve(stdout);
      });
    });
  });
};

/**
 * Listen for "src" data to be posted, compile that code data with solc and return the results as json
 */
app.post('/solc', function (req, res) {
  var src = req.body.src;
  compile(src).then(function (result) {
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  },
  function (err) {
    res.send(err);
  });
});

app.listen(3000, function () {
  console.log('Solc compiler listening on port 3000!');
});

