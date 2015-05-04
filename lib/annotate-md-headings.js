var through = require('through2');

module.exports = function(opts) {
  var headingsKey = (opts && opts.headingsKey ? opts.headingsKey : 'headings'),
      contentsKey = (opts && opts.contentsKey ? opts.contentsKey : 'contents');

  return through.obj(function annotateMarkdownHeadings(file, enc, onDone) {
      // file content is lexer output
      file[headingsKey] = file[contentsKey].filter(function(token) {
        return token.type == 'heading';
      }).map(function(token) {
        token.id = token.text.toLowerCase().replace(/[^\w]+/g, '-');
        return token;
      });
      this.push(file);
      onDone();
  });
};
