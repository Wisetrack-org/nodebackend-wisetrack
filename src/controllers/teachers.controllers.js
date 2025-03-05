import { connectDB } from "../mysql";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const teacherDashboard = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const teacherId = req.user.teacher_id;
  const connection = await connectDB();

  try {
    // Fetch students assigned to the teacher with academic details
    const [students] = await connection.execute(
      `SELECT 
        s.student_id,
        s.first_name, 
        s.last_name, 
        s.email,
        s.semester,
        c.class_name,
        c.branch,
        GROUP_CONCAT(sub.subject_name SEPARATOR ', ') AS subjects,
        a.attendance_percentage,
        AVG(g.grade_score) AS average_grade
      FROM Students s
      LEFT JOIN Classes c ON s.class_id = c.class_id
      LEFT JOIN StudentSubjects ss ON s.student_id = ss.student_id
      LEFT JOIN Subjects sub ON ss.subject_id = sub.subject_id
      LEFT JOIN Attendance a ON s.student_id = a.student_id
      LEFT JOIN Grades g ON s.student_id = g.student_id
      WHERE s.primary_teacher_id = ?
      GROUP BY s.student_id, s.first_name, s.last_name, s.email, 
               s.semester, c.class_name, c.branch, a.attendance_percentage`,
      [teacherId]
    );

    // Fetch teacher's own profile details
    const [teacherProfile] = await connection.execute(
      `SELECT first_name, last_name, email, department 
       FROM Teachers 
       WHERE teacher_id = ?`,
      [teacherId]
    );

    if (teacherProfile.length === 0) {
      throw new ApiError(404, "Teacher profile not found");
    }

    res.status(200).json(
      new ApiResponse(200, {
        teacher: teacherProfile[0],
        students: students.map(student => ({
          ...student,
          attendance_percentage: parseFloat(student.attendance_percentage),
          average_grade: parseFloat(student.average_grade.toFixed(2))
        }))
      }, "Teacher dashboard data fetched successfully")
    );

  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(500, "Failed to fetch dashboard data");
  } finally {
    connection.end();
  }
});

export { teacherDashboard };
