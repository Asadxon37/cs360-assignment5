import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("TranscriptStore", () => {
  let store;

  beforeEach(() => {
    store = new TranscriptStore();
  });

  test("adds students and returns their transcripts", () => {
    const studentID = store.addStudent("Ada");

    assert.equal(studentID, 1);
    assert.deepEqual(store.getTranscript(studentID), {
      student: { studentID, studentName: "Ada" },
      grades: [],
    });
  });

  test("adds and changes a course grade", () => {
    const studentID = store.addStudent("Lin");

    assert.deepEqual(store.addGrade(studentID, "cs360", "85"), {
      studentID,
      course: "CS360",
      grade: 85,
    });
    assert.deepEqual(store.changeGrade(studentID, "CS360", 92), {
      studentID,
      course: "CS360",
      grade: 92,
    });
  });

  test("rejects invalid student, course, and grade inputs", () => {
    const studentID = store.addStudent("Noah");

    assert.throws(() => store.addStudent("   "), /Student name is required/);
    assert.throws(() => store.addGrade(studentID, "", 90), /Course name is required/);
    assert.throws(
      () => store.addGrade(studentID, "CS360", 101),
      /Grade must be an integer from 0 to 100/,
    );
  });

  test("supports exact-name lookup and deletion", () => {
    const firstID = store.addStudent("Grace Lee");
    const secondID = store.addStudent("Grace Hall");

    assert.deepEqual(store.getStudentIDs("Grace Lee"), [firstID]);
    store.deleteStudent(secondID);
    assert.deepEqual(store.getStudentIDs(), [firstID]);
    assert.throws(() => store.deleteStudent(secondID), /Student not found/);
  });

  test("REF-201: changeGrade validates course and grade like addGrade", () => {
    const studentID = store.addStudent("Noah");
    store.addGrade(studentID, "CS360", 70);

    assert.throws(() => store.changeGrade(studentID, "  ", 80), /Course name is required/);
    assert.throws(
      () => store.changeGrade(studentID, "CS360", -1),
      /Grade must be an integer from 0 to 100/,
    );
    assert.throws(
      () => store.changeGrade(studentID, "CS360", 80.5),
      /Grade must be an integer from 0 to 100/,
    );
    assert.throws(() => store.changeGrade(studentID, "MA101", 80), /Grade not found for course MA101/);
    assert.equal(store.getGrade(studentID, "CS360"), 70);
  });

  test("REF-201: course names are trimmed and uppercased everywhere", () => {
    const studentID = store.addStudent("Noah");

    store.addGrade(studentID, " cs360 ", "70");

    assert.equal(store.getGrade(studentID, "Cs360"), 70);
    assert.equal(store.getGrade(studentID, ""), undefined);
  });
});
