const assert = require("node:assert");
const { test } = require("node:test");

const Parser = require("tree-sitter");

const PowerBuilderLanguage = require("./index")

test("can load grammar", () => {
  const parser = new Parser();
  assert.doesNotThrow(() => parser.setLanguage(PowerBuilderLanguage));
});
