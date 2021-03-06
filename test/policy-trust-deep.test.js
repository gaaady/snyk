var test = require('tap-only');
var Promise = require('es6-promise').Promise; // jshint ignore:line
var cli = require('../cli/commands');
var dir = __dirname + '/fixtures/qs-package';

var originalVulnCount;

test('`snyk test` sees suggested ignore policies', function (t) {
  return cli.test(dir).catch(function (res) {
    var vulns = res.message.toLowerCase();
    t.notEqual(vulns.indexOf('suggests ignoring this issue, with reason: test trust policies'), -1, 'found suggestion to ignore');

    originalVulnCount = (count('vulnerability found', vulns));
  });
});

test('`snyk test` ignores when applying `--trust-policies`', function (t) {
  return cli.test(dir, { 'trust-policies': true }).catch(function (res) {
    var vulnCount = count('vulnerability found', res.message.trim());
    t.equal(originalVulnCount - vulnCount, 2, '2 vulns ignored');
  });
});

function count(needle, haystack) {
  return (haystack.toLowerCase().match(new RegExp(needle.toLowerCase(), 'g')) ||
   []).length;
}
