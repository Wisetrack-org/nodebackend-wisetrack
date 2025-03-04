import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { selectFields } from "../utils/fieldSelection.js";
import { connectDB } from "../mysql/index.js";

const getUniDashboard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.university_id) {
    throw new ApiError(401, "Unauthorized: Please log in as a student.");
  }

  const uniId = req.user.university_id;

  const connection = await connectDB();

  const [teachers] = await connection.execute(
    `SELECT first_name, last_name FROM Teachers where university_id = ?`,
    [uniId]
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        teachers,
        "Student dashboard data fetched successfully"
      )
    );
});

export { getUniDashboard };
