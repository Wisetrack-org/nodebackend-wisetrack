import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { connectDB } from "../mysql/index.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    let connection;
    try {
        const token = req.cookies?.Authorization?.replace("Bearer ", "") || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET || 'your_secret_key');

        connection = await connectDB();
        let users;

        if (decodedToken.userType === 'students') {
            const [students] = await connection.execute(
                "SELECT student_id, first_name, last_name FROM Students WHERE student_id = ?",
                [decodedToken.studentId]
            );
            users = students;
        } else if (decodedToken.userType === 'teachers') {
            const [teachers] = await connection.execute(
                "SELECT * FROM Teachers WHERE teacher_id = ?",
                [decodedToken.teacherId]
            );
            users = teachers;
        } else if (decodedToken.userType === 'universities') {
            const [universities] = await connection.execute(
                "SELECT * FROM Universities WHERE university_id = ?",
                [decodedToken.universityId]
            );
            users = universities;
        } else if (decodedToken.userType === 'parents') {
            const [parents] = await connection.execute(
                "SELECT * FROM Students WHERE student_id = ?", 
                [decodedToken.studentId]
            )
            users = parents;
        }
        
        else {
            throw new ApiError(401, "Invalid user type");
        }

        if (users.length === 0) {
            throw new ApiError(401, "User not found");
        }

        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token format. Please log in again.");
        } else if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired. Please log in again.");
        } else {
            throw new ApiError(401, error.message || "Unauthorized request");
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
