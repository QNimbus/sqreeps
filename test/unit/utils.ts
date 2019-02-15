import { assert } from "chai";;
import { Game, Memory } from "./mock"

import { color } from "utils/utils";

describe("main", () => {
  before(() => {
  });

  beforeEach(() => {
  });

  it("should export a color function", () => {
    assert.isTrue(typeof color === "function");
  });

  it("should return a HTML string", () => {
    assert.isString(color('This is a test string', 'red'));
  });
});
