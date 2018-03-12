#!/usr/bin/env node

// No command line arguments, we're just going to use the env vars
let fs = require('fs');
let source = '.';
let target = 'akamai-appsec-' + JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

var exec = require('child-process-promise').exec;
//delete existing binaries.
exec(`ls | grep -e "akamai-appsec-.*-linux\\|mac\\|windows-.*" | xargs rm`).catch(err => {
  console.error('ERROR: Delete failed: ' + err);
});

exec(
  `pkg ${source} --target node8-linux-x86,node8-linux-x64,node8-win-x86,node8-win-x64,node8-macos-x64 --output ${target}`
)
  .then(function(result) {
    let stdout = result.stdout;
    let stderr = result.stderr;
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
  })
  .then(() => {
    exec(`ls ${target}*`)
      .then(result => {
        for (let filename of result.stdout.split('\n')) {
          if (!filename) {
            continue;
          }
          let oldname = filename;
          filename = filename.replace('-win-', '-windows-');
          filename = filename.replace('-x64', '-amd64');
          filename = filename.replace('macos', 'mac');
          filename = filename.replace('x86', '386');
          fs.renameSync(oldname, filename);
          require('child_process').execSync(
            `shasum -a 256 ${filename} | awk '{print $1}' > ${filename}.sig`
          );
        }
      })
      .catch(function(err) {
        console.error('ERROR: ', err);
      });
  });
