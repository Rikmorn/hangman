/**
 * Created by robertosousa on 10/02/2016.
 */

var mtOpts = require('commander');

function positive(v) {
  var number = parseInt(v);
  return (number <= 0) ? 1 : number;
}

mtOpts
  .option('-p, --port <n>', 'Port for service to use, defaults to 8882', positive)
  .option('-c, --cluster <n>', 'Clusters to use, defaults to 1, must be >= 1', positive)
  .parse(process.argv);

require('./lib')(mtOpts);
