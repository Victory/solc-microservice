var exec = require('child_process').exec;
var fs = require('fs');
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

// PoC for running cli solc from node
new Promise(function (resolve, reject) {
  fs.writeFile(spawnOptions.cwd + "/foo.sol", "contract abstract {}", function(err) {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
}).then(
  function () {
    console.log('done writting');
    return true;
  },
  showCwd
).then(function (ok) {
  if (!ok) {
    return;
  }
  exec(`solc foo.sol ${solcArgs}`, spawnOptions, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`cat foo.test: ${stdout}`);
    if (stderr.length > 0) {
      console.log(`stderr: ${stderr}`);
    }
  });
});


