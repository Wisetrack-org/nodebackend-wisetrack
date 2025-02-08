import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { student } from "../models/students.models.js"; // Adjust the import based on your file structure
import { teacher } from "../models/teacher.models.js"; // Adjust the import based on your file structure

// Create a new submission
const studentSubmission = asyncHandler(async (req, res) => {
    const studentData = req.body;

    // Validate required fields
    const requiredFields = [
        "uniqueId", // Change from uniqueId to id
        "bullying",
        "financialIssues", // Change from finance to financialIssues
        "mentalHealth", // Change from menIssue to mentalHealth
        "physicalHealth", // Change from phyIssue to physicalHealth
        "genderDiscrimination", // Change from discrimination to genderDiscrimination
        "physicalDisability", // Change from physical to physicalDisability
        "workingAndStudying", // Change from Working_and_Studying to workingAndStudying
        "interestedInStudies", // Change from Not_Interested to interestedInStudies
        "schoolFarOff" // Change from school_Far to schoolFarOff
    ];

    for (const field of requiredFields) {
        if (studentData[field] === undefined) {
            throw new ApiError(400, `${field} is required.`);
        }
    }

    // Create a new student submission instance
    const newSubmission = new student({
        uniqueId: studentData.uniqueId, // Ensure this matches the new payload structure
        bullying: studentData.bullying,
        financialIssues: studentData.financialIssues, // Ensure this matches the new payload structure
        mentalHealth: studentData.mentalHealth, // Ensure this matches the new payload structure
        physicalHealth: studentData.physicalHealth, // Ensure this matches the new payload structure
        genderDiscrimination: studentData.genderDiscrimination, // Ensure this matches the new payload structure
        physicalDisability: studentData.physicalDisability, // Ensure this matches the new payload structure
        workingAndStudying: studentData.workingAndStudying, // Ensure this matches the new payload structure
        interestedInStudies: studentData.interestedInStudies, // Ensure this matches the new payload structure
        schoolFarOff: studentData.schoolFarOff, // Ensure this matches the new payload structure 
    });

    // Save the submission to the database
    await newSubmission.save();

    // Send a success response
    res.status(201).json(
        new ApiResponse(201, "Submission created successfully", newSubmission)
    );
});

const teacherSubmission = asyncHandler(async (req, res) => {
    const teacherData = req.body;

    // Validate required fields
    const requiredFields = [
        "uniqueId",
        "attendance",
        "grades",
        "streak",
        "behaviour",
        "test",
        "attention",
    ];

    for (const field of requiredFields) {
        if (teacherData[field] === undefined) {
            throw new ApiError(400, `${field} is required.`);
        }
    }

    // Create a new teacher submission instance
    const newSubmission = new teacher({
        uniqueId: teacherData.uniqueId,
        attendance: teacherData.attendance,
        grades: teacherData.grades,
        streak: teacherData.streak,
        behaviour: teacherData.behaviour,
        test: teacherData.test,
        attention: teacherData.attention,
    });

    // Save the submission to the database
    await newSubmission.save();

    // Send a success response
    res.status(201).json(
        new ApiResponse(201, "Submission created successfully", newSubmission)
    );
});

// Export the handler
export { studentSubmission, teacherSubmission };
