'use strict';

var cp = require('child_process');
var async = require('./async');
var report = require('./report').report;

var hardwareCode = process.argv[2] || 'N7G1';

var connectionInfoPath = hardwareCode === 'N7G1' ?
  '/var/lib/sencha/connection_info.json' :
  '/var/lib/lamassu-machine/connection_info.json';
  
var restartCommand = hardwareCode === 'N7G1' ?
 'poweroff -d 2' :
 'restart lamassu-machine';


report(null, 'started', function() {});

var TIMEOUT = 10000;

function command(cmd, args, cb) {
  cp.execFile(cmd, args, {timeout: TIMEOUT}, function(err) {
    cb(err);
  });
}

console.log('********** STARTED *************');

// TODO: not idempotent, base this on versions
async.waterfall([
  async.apply(report, null, 'started'),
  async.apply(command, 'rm ' + connectionInfoPath),  
  async.apply(report, null, 'afterUnpair'),  
  async.apply(command, restartCommand),
  async.apply(report, null, 'afterRestart'),  
], function(err) {
  report(err, 'finished', function() {
    if (err) throw err;
    console.log('done updatescript');
    process.exit();    
  });
});
