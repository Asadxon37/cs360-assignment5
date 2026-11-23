import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { normalizeCourse, requireCourse, requireGrade } from "../src/validation.js";

describe("validation", () => {
  test("normalizeCourse trims, uppercases, and never throws", () => {
    assert.equal(normalizeCourse("  cs360 "), "CS360");
    assert.equal(normalizeCourse(undefined), "");
  });

  test("requireCourse rejects an empty course", () => {
    assert.equal(requireCourse(" ma101"), "MA101");
    assert.throws(() => requireCourse("   "), /Course name is required/);
  });

  test("requireGrade accepts integers 0-100 and rejects the rest", () => {
    assert.equal(requireGrade("85"), 85);
    assert.equal(requireGrade(0), 0);
    assert.equal(requireGrade(100), 100);
    for (const bad of [-1, 101, 80.5, "abc"]) {
      assert.throws(() => requireGrade(bad), /Grade must be an integer from 0 to 100/);
    }
  });
});
