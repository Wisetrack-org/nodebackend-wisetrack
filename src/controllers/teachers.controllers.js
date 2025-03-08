import { connectDB } from "../mysql/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const teacherDashboard = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const teacherId = req.user.teacher_id;
  const connection = await connectDB();

  try {
    // teacher classes
    const [teacherData] = await connection.execute(
      `SELECT 
          t.university_id,
          GROUP_CONCAT(CONCAT(tc.academic_year, '|', tc.branch, '|', c.class_id) SEPARATOR ';') AS assigned_classes
         FROM Teachers t
         LEFT JOIN TeacherClasses tc ON t.teacher_id = tc.teacher_id
         LEFT JOIN Classes c ON tc.class_id = c.class_id
         WHERE t.teacher_id = ?
         GROUP BY t.teacher_id`,
      [teacherId]
    );

    if (!teacherData.length) {
      throw new ApiError(404, "Teacher not found");
    }

    const { university_id, assigned_classes } = teacherData[0];

    // student ans class details
    const [students] = await connection.execute(
      `SELECT 
          s.student_id,
          s.first_name,
          s.last_name,
          s.email,
          s.semester,
          c.class_name,
          c.branch,
          c.academic_year,
          GROUP_CONCAT(DISTINCT sub.subject_name SEPARATOR ', ') AS subjects
        FROM Students s
        JOIN Classes c ON s.class_id = c.class_id
        LEFT JOIN TeacherClasses tc ON c.class_id = tc.class_id AND tc.teacher_id = ?
        LEFT JOIN StudentSubjects ss ON s.student_id = ss.student_id
        LEFT JOIN Subjects sub ON ss.subject_id = sub.subject_id
        WHERE 
          s.university_id = ? 
          AND (? IS NULL OR tc.teacher_id = ?)
        GROUP BY s.student_id, c.class_id;`,
      [teacherId, university_id, teacherId, teacherId]
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          university_id,
          assigned_classes: parseAssignedClasses(assigned_classes),
          students: students.map((student) => ({
            ...student,
          })),
        },
        "Dashboard data fetched successfully"
      )
    );
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(500, "Failed to fetch dashboard data");
  } finally {
    connection.end();
  }
});

// Helper function remains same
const parseAssignedClasses = (classString) => {
  return (
    classString?.split(";").map((c) => {
      const [year, branch, classId] = c.split("|");
      return { academic_year: year, branch, class_id: classId };
    }) || []
  );
};

const timeTableUpload = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(404, "Teacher not found");
  }

  const teacherId = req.user.teacher_id;
  if(!teacherId) {
    
  }
  const { week_start_date, timetable_data } = req.body;

  if (!week_start_date) {
    throw new ApiError(400, "Week start date is required");
  }

  if (!timetable_data) {
    throw new ApiError(400, "Timetable data is required");
  }

  const jsonData = JSON.stringify(timetable_data);
  const connection = await connectDB();

  try {
    const [existingTimetable] = connection.execute(
      `SELECT time_table_id from TimeTable WHERE teacher_id = ? AND week_start_date = ?`,
      [teacherId, week_start_date]
    );
    let timeTableId;

    if (existingTimeTable.length > 0) {
      timeTableId = await existingTimetable[0].time_table_id;
      await connection.execute(
        `UPDATE TimeTable 
         SET file_path = ?, upload_timestamp = CURRENT_TIMESTAMP 
         WHERE time_table_id = ?`,
        [jsonData, timeTableId]
      );
    } else {
      const [result] = await connection.execute(
        `INSERT INTO TimeTable (teacher_id, week_start_date, file_path)
         VALUES (?, ?, ?)`,
        [teacherId, week_start_date, jsonData]
      );
      timeTableId = result.insertId;
    }

    res.status(200).json(new
      ApiResponse(200, {
        time_table_id: timeTableId,
        teacher_id: teacherId,
        week_start_date,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Failed to upload timetable");
  } finally {
    connection.end();
  }
});

export { teacherDashboard, timeTableUpload };
