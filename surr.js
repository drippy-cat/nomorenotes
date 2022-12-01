/**
 * Converts a codepoint index in a string into a character index.
 * @param {number} p2_idx The codepoint index into the text.
 * @param {string} text The text.
 * @returns {number} The character index into the text.
 */

exports.unsurrogate = function (p2_idx, text) {
  if(typeof text != typeof 'string') throw new TypeError(`expected ${typeof 'string'}, got ${typeof text}`); // require string
  var p1_idx = p2_idx;
  for (var i = 0; i < text.length && i < p2_idx; i++) {
    var char_code = text.charCodeAt(i);
      // check for the first half of a surrogate pair
      if (char_code >= 0xD800 && char_code < 0xDC00) {
        p1_idx -= 1;
      }
    }
  return p1_idx;
};

/**
 * Converts a character index in a string into a codepoint index.
 * @param {number} p1_idx The character index into the text.
 * @param {string} text The text.
 * @returns {number} The codepoint index into the text.
 */

exports.surrogate = function (p1_idx, text) {
  if(typeof text != typeof 'string') throw new TypeError(`expected ${typeof 'string'}, got ${typeof text}`); // require string
  var p2_idx = p1_idx;
  for (var i = 0; i < text.length && i < p2_idx; i++) {
    var char_code = text.charCodeAt(i);
    // check for the first half of a surrogate pair
    if (char_code >= 0xD800 && char_code < 0xDC00) {
      p2_idx += 1;
    }
  }
  return p2_idx;
};

/**
 * Attempts to detect surrogate characters in a string.
 * @param {string} text The text to be checked for surrogate characters.
 * @returns {boolean} Whether or not surrogate characters were detected in the string.
 */
exports.issurrogate = function (text) {
  var p1_idx = text.length;
  return exports.surrogate(p1_idx, text) != p1_idx;
};
