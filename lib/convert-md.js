var through = require('through2'),
    marked = require('marked'),
    xtend = require('xtend');

var defaults = marked.defaults;

function convertMd(opts) {
  return through.obj(function(file, enc, onDone) {
    // create a new parser for every file.
    // marked has added a Slugger - a thing that assigns id's to headings.
    // The slugger is stateful so we need a fresh instance for each parse.

    // TODO: look into whether the ID generation is good enough that we can
    // stop doing it internally in this library.

    var parser = new marked.Parser(xtend(defaults, opts));

    file.contents = parser.parse(file.contents);
    // push to next transform
    this.push(file);
    onDone();
  });
}

module.exports = convertMd;
