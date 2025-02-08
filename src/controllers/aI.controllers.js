import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";
import { student } from "../models/students.models.js"; // Adjust the import based on your file structure
import { teacher } from "../models/teacher.models.js"; // Adjust the import based on your file structure

const predictStudent = asyncHandler(async (req, res) => {
    const { uniqueId } = req.body; // Assuming the unique ID is passed in the request body

    if (!uniqueId) {
        throw new ApiError(400, "Unique ID is required.");
    }

    try {
        // Retrieve student data from the database based on uniqueId
        const std = await student.findOne({ uniqueId });

        if (!std) {
            throw new ApiError(404, "Student not found.");
        }

        // Retrieve teacher data based on student's uniqueId
        const tea = await teacher.findOne({ uniqueId: std.uniqueId });

        if (!tea) {
            throw new ApiError(404, "Teacher not found.");
        }

        console.log(tea.attendance);
        

        // Combine student and teacher data into the correct format for FastAPI
        const combinedData = {
            Attendance: tea.attendance,
            Grades: tea.grades,
            Homework_Streak: tea.streak,
            Feedback_Behavior: tea.behaviour,
            Weekly_Test_Scores: tea.test,
            Attention_Test_Scores: tea.attention,
            Ragging: std.ragging || 0,
            Finance_Issue: std.financeIssue || 0,
            Mental_Health_Issue: std.mentalHealth || 0,
            Physical_Health_Issue: std.physicalHealth || 0,
            Discrimination_Based_on_Gender: std.discriminationBasedOnGender || 0,
            Physical_Disability: std.physicalDisability || 0,
            Not_Interested: std.notInterested || 0,
            Working_and_Studying: std.workingAndStudying || 0,
            School_Is_Far: std.schoolIsFar || 0,
        };

        // Log combined data for debugging
        console.log("Combined Data being sent to FastAPI:", combinedData);

        // Send combined data to FastAPI
        // const response = await axios.post("https://66f2f44233057800a664709c--starlit-puppy-f74507.netlify.app/predict", combinedData);
        const response = await axios.post("http://localhost:8000/predict", combinedData);

        // Return the prediction result
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error occurred while fetching prediction:", error); // Log full error for debugging

        if (error.response) {
            console.error("Response data:", error.response.data); // Log response data for further insight
            throw new ApiError(error.response.status, error.response.data);
        } else if (error.request) {
            throw new ApiError(500, "No response received from prediction service.");
        } else {
            throw new ApiError(500, `Unexpected error occurred: ${error.message}`);
        }
    }
});

export { predictStudent };