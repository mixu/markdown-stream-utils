var through = require('through2'),
    marked = require('marked'),
    xtend = require('xtend');

var defaults = marked.defaults;

function convertMd(opts) {
  var parser = new marked.Parser(xtend(defaults, opts));

  return through.obj(function(file, enc, onDone) {
    file.contents = parser.parse(file.contents);
    // push to next transform
    this.push(file);
    onDone();
  });
}

module.exports = convertMd;
