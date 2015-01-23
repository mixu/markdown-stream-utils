var hljs = require('highlight.js'),
    through = require('through2');

function hl(code, lang) {
  return '<pre class="hljs"><code>' + hljs.highlightAuto(code).value + '</code></pre>';
}

module.exports = function(customFn) {
  // code highlighting on lexer output
  return through.obj(function(file, enc, onDone) {
    file.contents.forEach(function(token, index) {
      if(token.type != 'code') {
        return;
      }
      if (customFn) {
        var result = customFn(token.text, token.lang);
        if (!result) {
          result = hl(token.text, token.lang);
        }
      } else {
        result = hl(token.text, token.lang);
      }

      file.contents[index] = { type: 'html', pre: false, text: result };
    });
    this.push(file);
    onDone();
  });
};
