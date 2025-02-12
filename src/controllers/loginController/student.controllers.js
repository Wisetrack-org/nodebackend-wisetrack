import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const studentLogin = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Error filling the form");
    }

    const student = await student.findOne({ id });

    if (!student) {
        throw new ApiError(404, "Student id not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Logged in successfully"));
});

export { studentLogin };
