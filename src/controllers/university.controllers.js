import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { selectFields } from "../utils/fieldSelection.js";
import { connectDB } from "../mysql/index.js";

const getUniDashboard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.university_id) {
    throw new ApiError(
      401,
      "Unauthorized: Please log in as a university admin."
    );
  }

  const uniId = req.user.university_id;
  const connection = await connectDB();

  try {
    // for teachers
    const [teachers] = await connection.execute(
      `SELECT first_name, last_name FROM Teachers WHERE university_id = ?`,
      [uniId]
    );

    // for students
    const [students] = await connection.execute(
      `SELECT 
        s.student_id,
        s.first_name, 
        s.last_name, 
        s.email, 
        s.semester, 
        c.class_name,
        c.branch,
        GROUP_CONCAT(sub.subject_name SEPARATOR ', ') AS subjects 
      FROM Students s
      LEFT JOIN Classes c ON s.class_id = c.class_id
      LEFT JOIN StudentSubjects ss ON s.student_id = ss.student_id
      LEFT JOIN Subjects sub ON ss.subject_id = sub.subject_id
      WHERE s.university_id = ?
      GROUP BY s.student_id, s.first_name, s.last_name, s.email, s.semester, c.class_name, c.branch`,
      [uniId]
    );

    const selectedTeachers = teachers.map((teacher) =>
      selectFields(teacher, req.query.fields)
    );
    const selectedStudents = students.map((student) =>
      selectFields(student, req.query.fields)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { teachers: selectedTeachers, students: selectedStudents },
          "University dashboard data fetched successfully"
        )
      );
  } catch (err) {
    console.error("MySQL Error:", err);
    throw new ApiError(500, "Internal Server Error");
  } finally {
    connection.end();
  }
});

export { getUniDashboard };
