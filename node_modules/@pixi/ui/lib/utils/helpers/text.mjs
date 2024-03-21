import { Text } from 'pixi.js';

function getTextView(text) {
  if (typeof text === "string" || typeof text === "number") {
    return new Text({ text: String(text) });
  }
  return text;
}

export { getTextView };
//# sourceMappingURL=text.mjs.map
