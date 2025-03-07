import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { selectFields } from "../utils/fieldSelection.js";
import { connectDB } from "../mysql/index.js";
import { transport } from "../middlewares/sendMail.js";
import dotenv from "dotenv";
//root:TohUZxnbTaGyjvbHGUAlnbpZwYsdGvSW@metro.proxy.rlwy.net:49101/railway
mysql: dotenv.config({
  path: "../../.env",
});

const getStudentDashbpoard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.student_id) {
    throw new ApiError(401, "Unauthorized: Please log in as a student.");
  }

  const connection = await connectDB();
  const studentId = req.user.student_id;

  const profileFields = "first_name,last_name";
  const studentProfile = selectFields(req.user, profileFields);

  const [subjects] = await connection.execute(
    `SELECT s.subject_id, s.subject_name FROM StudentSubjects ss 
     JOIN Subjects s ON ss.subject_id = s.subject_id 
     WHERE ss.student_id = ?`,
    [studentId]
  );

  const selectedSubjects = subjects.map((subject) =>
    selectFields(subject, "subject_id,subject_name")
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { studentProfile, subjects: selectedSubjects },
        "Student dashboard data fetched successfully"
      )
    );
});

const sendCode = asyncHandler(async (req, res) => {
  // if (!req.user || !req.user.email) {
  //   throw new ApiError(401, "Not Found");
  // }

  const { email } = req.body;

  if (!email) {
    throw new ApiError(404, "Student email not found");
  }

  const connection = await connectDB();
  // const studentId = req.user.student_id;
  const id = 1;

  if (!id) {
    throw new ApiError(404, "Student id not found");
  }

  const [studentData] = await connection.execute(
    `SELECT at_risk, email, first_name, last_name FROM Students WHERE student_id = ?`,
    [id]
  );

  if (!studentData.length) {
    throw new ApiError(404, "Student not found");
  }

  const { at_risk: atRiskStatus, first_name, last_name } = studentData[0];

  if (atRiskStatus === "No Risk" || atRiskStatus === "High Risk") {
    try {
      let info = await transport.sendMail({
        from: "shiv.test.dev@gmail.com",
        to: email || studentData[0].email,
        subject: "At Risk Notification",
        html: `<p>Dear ${first_name} ${last_name},</p>
                   <p>This is a notification that your at-risk status has been updated. Please contact the student support for further assistance.</p>`,
      });

      if (info.accepted.includes(email)) {
        console.log("At-risk email sent successfully to:", email);
      } else {
        console.error("Failed to send at-risk email:", info);
      }

      res
        .status(200)
        .json(
          new ApiResponse(200, "Mail sent successfully")
        );
    } catch (emailError) {
      console.error("Error sending at-risk email:", emailError);
      // Consider logging or other error handling here
    }
  }
});

export { getStudentDashbpoard, sendCode };
