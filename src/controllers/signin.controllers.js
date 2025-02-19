import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { doHashValidation } from '../utils/hashing.js';
import jwt from 'jsonwebtoken';
import { connectDB } from "../mysql/index.js";
// import { student } from "../models/students.models.js";

const studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const connection = await connectDB();

    try {
        const [students] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (students.length === 0) {
            throw new ApiError(404, "Student email not found");
        }

        const Student = students[0];

        // verify password
        const passwordMatch = await doHashValidation(password, Student.password);

        if (!passwordMatch) {
            throw new ApiError(401, "Invalid password");
        }

        // jwt
        const token = jwt.sign(
            { studentId: Student.id },
            process.env.TOKEN_SECRET || 'your_secret_key',
            { expiresIn: '8h' }
        );

        // cookie
        res.cookie("Authorization", "Bearer " + token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
        });

        return res
            .status(200)
            .json(new ApiResponse(200, Student, "Logged in successfully"));
    } catch (error) {
        console.error("MySQL Error:", error);
        throw new ApiError(500, "Internal Server Error");
    } finally {
        connection.end();
    }

});

export { studentLogin };