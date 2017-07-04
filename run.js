'use strict';

const sh = require('shelljs');

sh.config.fatal = true;

function bin(name) {
  return './node_modules/.bin/' + name;
}

function exec(...args) {
  return sh.exec(args.join(' '));
}

const tests = "'lib/**/__tests__/**/*.js'";
const sources = "'src/**/*.{ts,tsx}'";

exports.check = () => {
  sh.echo('# Checking the formatting of the sources #########################');

  exec(
    bin('prettier'),
    '--single-quote',
    '--no-bracket-spacing',
    '--parser', 'typescript',
    '--list-different',
    sources
  );

  return '';
};

exports.compile = () => {
  exports.lint();
  exports.check();

  sh.echo('# Compiling the sources ##########################################');

  sh.rm('-rf', 'lib');

  exec(bin('tsc'));

  return '';
};

exports.format = () => {
  sh.echo('# Formatting the sources #########################################');

  exec(
    bin('prettier'),
    '--single-quote',
    '--no-bracket-spacing',
    '--parser', 'typescript',
    '--write',
    sources
  );

  return '';
};

exports.lint = () => {
  sh.echo('# Linting the commit message #####################################');

  exec(bin('conventional-changelog-lint'), '--from=HEAD~1');

  sh.echo('# Linting the sources ############################################');

  exec(bin('tslint'), sources);

  return '';
};

exports.test = () => {
  exports.compile();

  sh.echo('# Running the unit tests #########################################');

  sh.rm('-rf', '.nyc_output');
  sh.rm('-rf', 'coverage');

  exec(
    bin('nyc'),
    bin('mocha'),
    '--compilers', 'ts:espower-typescript/guess',
    '--require', 'lib/test/setup.js',
    tests
  );

  exec(
    bin('nyc'),
    'report',
    '--reporter', 'json',
    '--reporter', 'html'
  );

  return '';
};

exports.release = () => {
  const branchName = exec(
    'git', 'rev-parse', '--abbrev-ref', 'HEAD'
  ).stdout.trim();

  if (branchName !== 'master') {
    sh.echo('Error: Please checkout the master branch');
    sh.exit(1);
  }

  const gitStatus = exec('git', 'status', '--porcelain').stdout.trim();

  if (gitStatus !== '') {
    sh.echo('Error: Dirty Git working tree');
    sh.exit(1);
  }

  exports.test();

  sh.echo('# Releasing a new version ########################################');

  exec(bin('standard-version'));

  return '';
};

require('make-runnable/custom')({
  printOutputFrame: false
});
