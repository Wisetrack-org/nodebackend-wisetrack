import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { student } from "../../models/students.models.js";
import { doHashValidation } from '../../utils/hashing.js';
import jwt from 'jsonwebtoken';

const studentLogin = asyncHandler(async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        throw new ApiError(400, "ID and password are required");
    }

    const Student = await student.findOne({ id }).select("+password");

    if (!Student) {
        throw new ApiError(404, "Student ID not found");
    }

    const passwordMatch = await doHashValidation(password, Student.password);

    if (!passwordMatch) {
        throw new ApiError(401, "Invalid password");
    }

    const token = jwt.sign(
        { studentId: Student._id },
        process.env.TOKEN_SECRET || 'your_secret_key',
        { expiresIn: '8h' }
    );

    res.cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
    });

    return res
        .status(200)
        .json(new ApiResponse(200, Student, "Logged in successfully"));

});

export { studentLogin };