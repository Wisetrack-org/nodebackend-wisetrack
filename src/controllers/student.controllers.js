import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { selectFields } from "../utils/fieldSelection.js";

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(
      401,
      "Unauthorized: User info is missing, try logging in again!"
    );
  }
  console.log(req.user);
  

  const fields = "first_name,last_name";

  const studentProfile = selectFields(req.user, fields);

  res
    .status(200)
    .json(new ApiResponse(200, studentProfile, "API fetched successfully"));
});

export { getUserProfile };
