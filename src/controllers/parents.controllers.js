import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { connectDB } from "../mysql/index.js";

const parentDashboard = asyncHandler(async (req, res) => {
  console.log("User from request:", req.user);

  if (!req.user || !req.user.student_id) {  
    throw new ApiError(
      401,
      "Unauthorized: Student ID missing. Please log in again."
    );
  }

  const student_id = req.user.student_id;
  console.log("Extracted Student ID:", student_id);

  const connection = await connectDB();
  try {
    const [student] = await connection.execute(
      `SELECT student_id, first_name, last_name, email FROM Students WHERE student_id = ?`,
      [student_id]
    );

    if (student.length === 0) {
      throw new ApiError(404, "Student not found");
    }

    res.json({ success: true, student: student[0] });
  } catch (error) {
    console.error("Error fetching student data:", error);
    throw new ApiError(500, "Error fetching student data");
  } finally {
    connection.end();
  }
});

export { parentDashboard };
