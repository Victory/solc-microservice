var exec = require('child_process').exec;
var fs = require('fs');

var express = require('express');
var app = express();

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

var compile = function () {
  // PoC for running cli solc from node
  return new Promise(function (resolve, reject) {

    // save the input to a temp file
    fs.writeFile(spawnOptions.cwd + "/foo.sol", "contract abstract {}", function (err) {
      if (err) {
        reject(Promise.reject(err));
        return;
      }
      resolve();
    });
  }).then(
    function () {
      // debug
      console.log('done writting');
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

app.get('/', function (req, res) {
  compile().then(function (result) {
    res.setHeader('Content-Type', 'application/json');
    console.log(result);
    res.send(result);
  },
  function (err) {
    res.send(err);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

