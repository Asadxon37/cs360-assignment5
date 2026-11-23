/** Shared course and grade validation used by TranscriptStore. */

/** Trim and uppercase a course code. Never throws (used for lookups). */
export function normalizeCourse(course) {
  return String(course ?? "").trim().toUpperCase();
}

/** Like normalizeCourse, but rejects an empty course code. */
export function requireCourse(course) {
  const normalizedCourse = normalizeCourse(course);
  if (!normalizedCourse) {
    throw new Error("Course name is required");
  }
  return normalizedCourse;
}

/** Convert a grade to a number and require an integer from 0 to 100. */
export function requireGrade(grade) {
  const numericGrade = Number(grade);
  if (!Number.isInteger(numericGrade) || numericGrade < 0 || numericGrade > 100) {
    throw new Error("Grade must be an integer from 0 to 100");
  }
  return numericGrade;
}
