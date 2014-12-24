# markdown-stream-utils

Utility functions for processing markdown files using object mode streams. Used by [markdown-styles](https://github.com/mixu/markdown-styles) and by [ghost-render](https://github.com/mixu/ghost-render).

# API

## Getting started

All of the `markdown-stream-utils` functions expect to receive objects representing each markdown file. The files should have three properties:

- `path`: a path to the original filename
- `stat`: fs.stats object
- `contents`: the contents of the file as a string

Here's a full example of using `markdown-stream-utils`, with some helpers from `[pipe-iterators](https://github.com/mixu/pipe-iterators)`:


```js
var pi = require('pipe-iterators'),
    md = require('markdown-stream-utils');

pi.fromArray([ __dirname + '/foo.md', __dirname + '/bar.md' ])
  .pipe(pi.thru.obj(function(file, enc, onDone) {
    var stat = fs.statSync(file);
    if (stat.isFile()) {
      this.push({
        path: file,
        stat: stat,
        contents: fs.readFileSync(file).toString()
      });
    }
    onDone();
  }))
  .pipe(md.parseHeader())
  .pipe(md.parseMd())
  .pipe(md.highlightJS())
  .pipe(md.convertMd())
  .pipe(pi.toArray(function(results) {
    console.log(results);
  }));
```

## parseHeader()

```js
.pipe(md.parseHeader())
```

Parses header sections in markdown files. For example, given a object with the following `content` field:

```
---
title: Hello world
author: foo
---
# Heading
...
```

it will augment the existing object with two new fields: `title` and `author` with the specified values.

The header section will be removed from `content`, so that only the markdown content after the `---` will be kept in the `content` key.

TODO:

- yaml parsing
- JSON parsing
- optional first heading
- customize:
    - `contents` field
    - `metadata` storage key

## parseMd()

```js
pipe(md.parseMd())
```

Given an object with a `contents` field, executes `marked.lexer()` on the contents field. The new value is the lexer tree from `marked`.

## highlightJS()

```js
pipe(md.highlightJS())
```

Iterates over the lexer tree from `parseMd`, and executes a code highlighter on each code block.

TODO:

- make it take a callback (`function(code, lang) {}`)
- customize the `contents` field

## annotateMdHeadings()

```js
pipe(md.annotateMdHeadings())
```

Iterates over the lexer tree from `parseMd`. Annotates every heading with an id, so that when converted to HTML the headings can be targeted via links.

Also produces a list of all headings under `headings`. The value is an array of lexer tokens with an `id` property.

## convertMd()

```js
pipe(md.convertMd())
```

Given an object with a `contents` field, executes `marked.parse()` on the contents field. The new value is the HTMLs from `marked`.

