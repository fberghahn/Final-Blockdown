'use strict';

var pixi_js = require('pixi.js');

function getTextView(text) {
  if (typeof text === "string" || typeof text === "number") {
    return new pixi_js.Text({ text: String(text) });
  }
  return text;
}

exports.getTextView = getTextView;
//# sourceMappingURL=text.js.map
