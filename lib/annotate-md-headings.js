var through = require('through2');

module.exports = function(opts) {
  var headingsKey = (opts && opts.headingsKey ? opts.headingsKey : 'headings'),
      contentsKey = (opts && opts.contentsKey ? opts.contentsKey : 'contents');

    return through.obj(function annotateMarkdownHeadings(file, enc, onDone) {
      // reset the header counts for each file, so that idCount is not shared across the whole render
      var idCount = {};

      // key for the headings metadata
      file[headingsKey] = [];
      // file content is lexer output
      file[contentsKey].forEach(function(token) {
        if (token.type !== 'heading') {
          return token;
        }

        // TODO: this currently matches the logic in Slugger.js
        // in marked -- but it might go out of sync.
        //
        // Ideally, marked would assign ids in the parse stage (or separately)
        // so that we could just read what the IDs are separately, because
        // knowing what the generated IDs will be is useful e.g. for rendering
        // a TOC for a file (before it has been rendered).

        var id = token.text.trim().toLowerCase().replace(/\s+/g, '-');
        // do nothing the first time a heading is seen
        if (!idCount.hasOwnProperty(id)) {
          idCount[id] = 0;
        } else {
          // when duplicate headings are seen, append a dash-number starting with 1
          idCount[id]++;
          id += '-' + idCount[id];
        }
        token.id = id;
        // add to the list of headings as metadata
        file[headingsKey].push(token);
        return token;
      });
      this.push(file);
      onDone();
  });
};
