/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

var docblockRe = /^\s*(\/\*\*(.|\n)*?\*\/)/;
var ltrimRe = /^\s*/;
/**
 * @param {String} contents
 * @return {String}
 */
function extract(contents) {
  var match = contents.match(docblockRe);
  if (match) {
    return match[0].replace(ltrimRe, '') || '';
  }
  return '';
}


var commentStartRe = /^\/\*\*?/;
var commentEndRe = /\*\/$/;
var wsRe = /[\t ]+/g;
var stringStartRe = /(\n|^) *\*/g;
var multilineRe = /(?:^|\n) *(@[^\n]*?) *\n *([^@\n\s][^@\n]+?) *\n/g;
var propertyRe = /(?:^|\n) *@(\S+) *([^\n]*)/g;
/**
 * @param {String} contents
 * @return {Array}
 */
function parse(docblock) {
  docblock = docblock
    .replace(commentStartRe, '')
    .replace(commentEndRe, '')
    .replace(wsRe, ' ')
    .replace(stringStartRe, '$1');

  // Normalize multi-line directives
  var prev = '';
  while (prev != docblock) {
    prev = docblock;
    docblock = docblock.replace(multilineRe, "\n$1 $2\n");
  }

  var result = [];
  var match;
  while (match = propertyRe.exec(docblock)) {
    result.push([match[1], match[2]]);
  }

  return result;
}


exports.extract = extract;
exports.parse = parse;