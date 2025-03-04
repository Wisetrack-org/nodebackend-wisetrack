import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { selectFields } from "../utils/fieldSelection.js";
import { connectDB } from "../mysql/index.js";

const getStudentDashbpoard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.student_id) {
    throw new ApiError(401, "Unauthorized: Please log in as a student.");
  }

  const connection = await connectDB();
  const studentId = req.user.student_id;
  
  const profileFields = "first_name,last_name";
  const studentProfile = selectFields(req.user, profileFields);

  const [subjects] = await connection .execute(
    `SELECT s.subject_id, s.subject_name FROM StudentSubjects ss 
     JOIN Subjects s ON ss.subject_id = s.subject_id 
     WHERE ss.student_id = ?`,
    [studentId]
  );

  const selectedSubjects = subjects.map((subject) =>
    selectFields(subject, "subject_id,subject_name")
  );

  res.status(200).json(new ApiResponse(200, { studentProfile, subjects: selectedSubjects }, "Student dashboard data fetched successfully"));
});

export { getStudentDashbpoard };
